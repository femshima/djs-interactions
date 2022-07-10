import { DataTypes, InteractionTypes } from './bases';
import InteractionFrame from './frame';
import { DelayedDataStore } from './store';

const store = new DelayedDataStore<DataTypes[keyof InteractionTypes]>();

export const frame = new InteractionFrame({ store });

export const Command = frame.Base('CHAT_INPUT');
export const MessageContextMenu = frame.Base('MESSAGE');
export const UserContextMenu = frame.Base('USER');
export const Button = frame.Base('BUTTON');
export const SelectMenu = frame.Base('SELECT_MENU');
export const Modal = frame.Base('MODAL');
