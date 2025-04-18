import { ExtendedContext } from "../interfaces";

export class CommonController {
    static enterScene(scene: string) {
        return async (ctx: ExtendedContext) => {
            await ctx.scene.enter(scene);
        };
    }
}