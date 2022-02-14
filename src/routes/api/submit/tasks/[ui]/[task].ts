import database from '$lib/utils/database';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';
import exercises from '$lib/data/exercises.json';
import type { TrackingData } from '$lib/stores/taskTracking';

export const post: RequestHandler = async ({ request, params }) => {
  if (request.headers.get('cookie') === null) {
    return { status: 401, body: 'invalid token' };
  }
  const cookies = cookie.parse(request.headers.get('cookie'));
  const taskid = parseInt(params.task);
  const ui = parseInt(params.ui);

  const taskids: Array<number> = exercises.map((e) => e.id);
  if (!taskids.includes(taskid)) return { status: 404, body: 'task not found' };

  const proband = (await database('proband_data')).find((x) => x.token === cookies.token);
  if (proband === undefined) return { status: 401, body: 'invalid token' };

  const uid = proband.id;
  if (
    (await database('tasks')).find((x) => x.uid === uid && x.ui === ui && x.taskid === taskid) !==
    undefined
  )
    return {
      status: 400,
      body: 'already data submitted for this token and task'
    };

  const data = await request.json();
  const tracking: TrackingData[] = data.tracking;

  // Save answers in database
  await database('tasks').insert({
    uid: uid,
    ui: ui,
    taskid: taskid,
    members: JSON.stringify(data.members),
    start: tracking.find((t: TrackingData) => t.action === 'start').timestamp,
    end: tracking.find((t: TrackingData) => t.action === 'fulfilled').timestamp
  });

  tracking.forEach(async (x) => {
    let data = x.data ? JSON.stringify(x.data) : undefined;
    await database('task_tracking').insert({
      uid: uid,
      ui: ui,
      taskid: taskid,
      action: x.action,
      data: data,
      timestamp: x.timestamp
    });
  });
  return {};
};
