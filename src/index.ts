import { Context, Schema,Logger } from 'koishi'

export const name = 'screeps-tool'

const logger = new Logger('screeps-tool')

export interface Config {
  apiUrl: string
}

export const Config: Schema<Config> = Schema.object({
  apiUrl: Schema.string().description('API 服务器的 URL').default('http://api-screeps.mofengfeng.com/api/portals/find_route'),
});

export function apply(ctx: Context, config: Config) {
  // write your plugin here
  ctx.command('寻路 <from> <to>')
      .alias('route')
      .example('寻路 shard3_E31S39 shard3_E48S41')
      .action(async ({ session }, from, to) => {
        if (!from || !to) {
          return '请提供起始点和目标点。用法: 寻路 <from> <to>';
        }
        logger.debug('from', from);
        logger.debug('to', to);
        const apiUrl = `${config.apiUrl}?from=${from}&to=${to}`;
        try {
          const response = await ctx.http.get(apiUrl);
          if (typeof response === 'object') {
            return `路径查询成功: ${JSON.stringify(response)}`;
          } else {
            return `路径查询成功: ${response}`;
          }
        } catch (error) {
          logger.error('API 查询失败:', error);
          return '路径查询失败，请稍后再试。';
        }
      });
}
