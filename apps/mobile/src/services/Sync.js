import {updateEvent} from '../components/DialogManager/recievers';
import {Actions} from '../provider/Actions';
import {db} from '../utils/DB';
import {eOpenLoginDialog} from '../utils/Events';
import {eSendEvent,  ToastEvent, } from './EventManager';

const run = async (context = 'global') => {
  updateEvent({
    type: Actions.SYNCING,
    syncing: true,
  });

  try {
    await db.sync();
    ToastEvent.show({
      heading:"Sync complete",
      type:"success",
      message: "All your notes are encrypted and synced successfully!",
      context: context,
    });
  } catch (e) {
    console.log(e);
    if (e.message === 'You need to login to sync.') {
      ToastEvent.show({
        heading:"Enable sync",
        message: "Login to encrypt and sync notes.",
        context: context,
        func: () => {
          eSendEvent(eOpenLoginDialog);
        },
        actionText: 'Login',
      });
    } else {
      updateEvent({
        type: Actions.SYNCING,
        syncing: false,
      });
      ToastEvent.show({
        heading:"Sync failed",
        message: e.message,
        context: context,
      });
    }
  } finally {
    updateEvent({
      type: Actions.LAST_SYNC,
      lastSync: await db.lastSynced(),
    });
    updateEvent({type: Actions.ALL});
    updateEvent({
      type: Actions.SYNCING,
      syncing: false,
    });
  }
};

export default {
  run,
};
