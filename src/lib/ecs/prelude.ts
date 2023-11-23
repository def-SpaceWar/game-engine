import { Entity } from "./base";

class TreeNode {
    public entity: Entity = undefined as unknown as Entity;

    /**
     * @constructor @deprecated DO NOT USE THIS CONSTRUCTOR. USE THE HELPER
     * FUNCTIONS PROVIDED.
     */
    constructor(public up: Entity | undefined, public down: Entity[]) { }
}

// a --- b0
//    |- b1
//    .
//    .
//    .
//    |- b(n - 2)
//    -- b(n - 1)
/**
 * @param {Entity} a - Parent of the tree.
 * @param {Entity[]} bs - Children of the tree.
 * 
 * @description - Enforces the hierarchy specified.
 */
export function entityTree(a: Entity, ...bs: Entity[]) {
    const aNode = a.$get(TreeNode);
    if (aNode) aNode.down.concat(bs);
    else a.add(new TreeNode(undefined, bs));

    const size = bs.length;
    for (let i = 0, b = bs[i], bNode = b.$get(TreeNode); i < size; i++)
        if (bNode) bNode.up = a;
        else b.add(new TreeNode(a, []));
}

export const getParent = (e: Entity) => e.$get(TreeNode)?.up;
export const getChildren = (e: Entity) => e.$get(TreeNode)?.down;
