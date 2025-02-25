import type React from "react";

import { Button } from "@components/form/Button.js";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { XCircleIcon } from "@heroicons/react/24/outline";

export interface DeviceWidgetProps {
  name: string;
  nodeNum: string;
  disconnected: boolean;
  disconnect: () => void;
  reconnect: () => void;
}

export const DeviceWidget = ({
  name,
  nodeNum,
  disconnected,
  disconnect,
  reconnect
}: DeviceWidgetProps): JSX.Element => {
  return (
    <div className="relative flex shrink-0 flex-col overflow-hidden rounded-md text-sm text-textPrimary">
      <div className="absolute bottom-20 h-full w-full">
        <Hashicon size={350} value={nodeNum} />
      </div>
      <div className="backdrop-brightness-50 flex p-3 backdrop-blur-md backdrop-hue-rotate-30">
        <div>
          <Hashicon size={96} value={nodeNum} />
        </div>
        <div className="flex w-full flex-col">
          <span className="ml-auto whitespace-nowrap text-xl font-bold">
            {name}
          </span>
          <div className="my-auto ml-auto">
            <Button
              onClick={disconnected ? reconnect : disconnect}
              size="sm"
              iconBefore={<XCircleIcon className="h-4" />}
            >
              {disconnected ? "Reconnect" : "Disconnect"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
