import { Entity, World } from "../ecs/base";

export class TreeNode {
    entity?: Entity;
    constructor(public up: number | undefined, public down: number[]) { }
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
 * @description - Enforces the hierarchy specified. It's only your fault if
 * you mess up while using this.
 */
export const
    entityTree = (world: World, a: number, ...bs: number[]) => {
        const entityA = world.get(a),
            aNode = entityA?.get(TreeNode);
        if (aNode) aNode.down = aNode.down.concat(bs);
        else if (entityA) entityA.add(new TreeNode(undefined, bs));
        else return;

        const size = bs.length;
        for (let i = 0, b = world.get(bs[i]), bNode = b?.get(TreeNode); i < size; i++)
            if (bNode) bNode.up = a;
            else b?.add(new TreeNode(a, []));
    },
    getParent = (e: Entity) => e.get(TreeNode)?.up,
    getChildren = (e: Entity) => e.get(TreeNode)?.down;
