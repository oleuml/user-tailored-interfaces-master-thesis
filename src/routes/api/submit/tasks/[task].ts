import database from '$lib/utils/database';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const post: RequestHandler = async (request) => {
  const cookies = cookie.parse(request.headers.cookie);
  const taskid = parseInt(request.params.task);
  if (taskid < 0 || taskid > 3) return { status: 404, body: 'task not found' };

  const proband = (await database('proband_data')).find((x) => x.token === cookies.token);
  if (proband === undefined) return { status: 401, body: 'invalid token' };

  const uid = proband.id;
  if ((await database('tasks')).find((x) => x.uid === uid && x.taskid === taskid) !== undefined)
    return {
      status: 400,
      body: 'already data submitted for this token and task'
    };

  // Save answers in database
  await database('tasks').insert({
    uid: uid,
    taskid: taskid,
    members: JSON.stringify(request.body.members),
    start: request.body.start,
    end: request.body.end
  });

  const tracking = request.body.tracking;

  tracking.forEach(async (x) => {
    let data;
    if (x.action === 'scroll') {
      data = JSON.stringify({
        sh: x.data.scrollHeight,
        // sl: x.data.scrollLeft,
        // slm: x.data.scrollLeftMax,
        st: x.data.scrollTop,
        stm: x.data.scrollTopMax
      });
    } else {
      data = x.data ? JSON.stringify(x.data) : undefined;
    }
    await database('task_tracking').insert({
      uid: uid,
      taskid: taskid,
      action: x.action,
      position: x.pos,
      data: data,
      timestamp: x.t
    });
  });
  return {};
};
