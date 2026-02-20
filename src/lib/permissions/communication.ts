import { hasPermission } from ".";

export const canViewCommunication = (permissions: string[] | undefined) => hasPermission(permissions, "view_communication");

export const canManageCommunication = (permissions: string[] | undefined) => hasPermission(permissions, "manage_communication");

export const canDeleteCommunication = (permissions: string[] | undefined) => hasPermission(permissions, "delete_communication");

export const canSendCommunication = (permissions: string[] | undefined) => hasPermission(permissions, "send_communication");
