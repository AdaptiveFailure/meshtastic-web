import { IsBoolean, Length } from "class-validator";

import type { Protobuf } from "@meshtastic/meshtasticjs";

export class MQTTValidation implements Protobuf.ModuleConfig_MQTTConfig {
  @IsBoolean()
  enabled: boolean;

  @Length(0, 30)
  address: string;

  @Length(0, 30)
  username: string;

  @Length(0, 30)
  password: string;

  @IsBoolean()
  encryptionEnabled: boolean;

  @IsBoolean()
  jsonEnabled: boolean;
}
