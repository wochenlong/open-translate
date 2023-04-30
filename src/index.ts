import { Context, Schema } from "koishi";
import {} from "@mirror_cy/gpt";

export const name = "glm-translate";

export interface Config {}

export const Config: Schema<Config> = Schema.object({});

export function apply(ctx: Context) {
  ctx.i18n.define("zh", require("./locales/zh"));
  const cmd = ctx
    .command(`${name} <你要翻译的内容:text>`)
    .alias("翻译")
    .action(async ({ session }, text) => {
      const id = `${session.platform}-${session.userId}-${session.selfId}-${name}`;
      if (!text) return session.execute(`help ${name}`);

      const prompt = session.text(".prompt.base", { text });
      await ctx.gpt.ask(prompt, id).then(({ text }) => {
        session.send(text);
      });
      await ctx.gpt.reset(id);
    });
}
