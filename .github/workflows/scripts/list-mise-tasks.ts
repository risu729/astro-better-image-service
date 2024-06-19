// biome-ignore lint/nursery/noUndeclaredDependencies:
import { $ } from "bun";
import {
	type EdgeModel,
	type NodeModel,
	type NodeRef,
	fromDot,
} from "ts-graphviz";

$.throws(true);

const ciTaskDepsDot = await $`mise tasks deps ci --dot`.text();

const ciTasks = fromDot(ciTaskDepsDot);

const rootNode = ciTasks.nodes.find(
	(node) => node.attributes.get("label") === "ci",
);

if (!rootNode) {
	throw new Error("task 'ci' not found in `mise tasks deps ci --dot`");
}

const getEdgeTargets = ({ targets }: EdgeModel) => {
	const isNodeRef = (target: (typeof targets)[number]): target is NodeRef => {
		return !Array.isArray(target);
	};

	if (!isNodeRef(targets[0])) {
		throw new Error("unexpected edge target type");
	}
	if (!isNodeRef(targets[1])) {
		throw new Error("unexpected edge target type");
	}
	return {
		from: targets[0],
		to: targets[1],
	};
};

const getNodeFromRef = ({ id }: NodeRef) => {
	const node = ciTasks.nodes.find((node) => node.id === id);
	if (!node) {
		throw new Error(`node with id ${id} not found`);
	}
	return node;
};

const getNodeLabel = (node: NodeModel) => {
	const label = node.attributes.get("label");
	if (!label) {
		throw new Error("missing label in node");
	}
	return label;
};

const tasks: {
	name: string;
	task: string;
}[] = ciTasks.edges
	.map(getEdgeTargets)
	.filter(({ from }) => from.id === rootNode.id)
	.map(({ to }) => {
		const taskName = getNodeLabel(getNodeFromRef(to));
		// remove prefix if exists
		const name = taskName.split(":")[1] ?? taskName;
		return {
			name: name,
			task: taskName,
		};
	});

console.write(JSON.stringify(tasks));
