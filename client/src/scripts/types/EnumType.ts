//不要在TypeScript（*.d.ts）文件中定义枚举。
//ref:https://lukasbehal.com/2017-05-22-enums-in-declaration-files/
//ref:https://stackoverflow.com/questions/38335668/how-to-refer-to-typescript-enum-in-d-ts-file-when-using-amd/48159049'#48159049
export enum EBuyRecordType {
  邮箱已验证 = 0,
  待验证 = 1,
  购买成功 = 2,
  暂停付款 = 3,
  账户已停用 = 4
}

export enum EBuyRecordColor {
  '#00b8ff' = 0,
  '#4510e6' = 1,
  '#23BF07' = 2,
  '#ab7e01' = 3,
  '#e83e8c' = 4
}

export enum EOperateInboxDirect {
  全部 = 0,
  无 = 1,
  已读 = 2,
  未读 = 3,
  已加星标 = 4,
  未加星标 = 5
}

export enum EInboxMoveMenu {
  垃圾邮件 = 0,
  已发送文件 = 1,
  已删除文件 = 2
}

export enum EUserSex {
  男 = 0,
  女 = 1
}
