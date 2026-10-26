import type { RowDataPacket } from "mysql2";

export type UserRoleRowsName = RowDataPacket & {
  name: string;
}
