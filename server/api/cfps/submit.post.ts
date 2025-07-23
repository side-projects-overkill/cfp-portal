import { supabase } from "~/server/utils/supabase";

export default defineEventHandler (async (event) => {
  const body = await readBody(event);
  const {
    user_id,
    conference_id,
    title,
    description,
    target_audience,
    track,
    level,
    session_type,
    duration,
    speaker_bio,
    co_speakers
  } = body;

  const { data, error} = await supabase
    .from('cfps')
    .insert ([{
      user_id,
      conference_id,
      title,
      description,
      target_audience,
      track,
      level,
      session_type,
      duration,
      speaker_bio,
      co_speakers
    }])

    if(error){
    return {
      status: 'error',
      message: 'Failed to submit CFP',
      error: error.message
    }
  }

  return {
    status: 'success',
    message: 'CFP submitted successfully!',
    data
  }
})