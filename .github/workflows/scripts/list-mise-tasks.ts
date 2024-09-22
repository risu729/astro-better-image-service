import { $ } from "bun";
import { type EdgeModel, type NodeRef, fromDot } from "ts-graphviz";

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

const getChildNodes = (
	node: NodeRef,
	edges: ReturnType<typeof getEdgeTargets>[],
	recursive = false,
): NodeRef[] => {
	const children = edges
		.filter(({ from }) => from.id === node.id)
		.map(({ to }) => to);

	if (recursive) {
		return children.flatMap((child) => [
			child,
			...getChildNodes(child, edges, true),
		]);
	}

	return children;
};

const getNodeLabel = ({ id }: NodeRef) => {
	const node = ciTasks.nodes.find((node) => node.id === id);
	if (!node) {
		throw new Error(`node with id ${id} not found`);
	}
	const label = node.attributes.get("label");
	if (!label) {
		throw new Error("missing label in node");
	}
	return label;
};

const edges = ciTasks.edges.map(getEdgeTargets);

const tasks: {
	name: string;
	task: string;
	buni: boolean;
}[] = getChildNodes(rootNode, edges).map((to) => {
	const taskName = getNodeLabel(to);
	// remove prefix if exists
	const name = taskName.split(":")[1] ?? taskName;

	const depends = getChildNodes(to, edges, true).map((node) =>
		getNodeLabel(node),
	);

	return {
		name: name,
		task: taskName,
		buni: depends.some((dep) => dep === "buni"),
	};
});

console.write(JSON.stringify(tasks));
