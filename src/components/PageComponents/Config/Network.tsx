import type React from "react";
import { useEffect } from "react";

import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";

import { FormSection } from "@app/components/form/FormSection.js";
import { Input } from "@app/components/form/Input.js";
import { Select } from "@app/components/form/Select.js";
import { Toggle } from "@app/components/form/Toggle.js";
import { renderOptions } from "@app/core/utils/selectEnumOptions.js";
import { NetworkValidation } from "@app/validation/config/network.js";
import { Form } from "@components/form/Form";
import { useDevice } from "@core/providers/useDevice.js";
import { ErrorMessage } from "@hookform/error-message";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { Protobuf } from "@meshtastic/meshtasticjs";

export const Network = (): JSX.Element => {
  const { config, connection, setConfig } = useDevice();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    reset
  } = useForm<NetworkValidation>({
    defaultValues: config.network,
    resolver: classValidatorResolver(NetworkValidation)
  });

  const wifiEnabled = useWatch({
    control,
    name: "wifiEnabled",
    defaultValue: false
  });

  const ethEnabled = useWatch({
    control,
    name: "ethEnabled",
    defaultValue: false
  });

  const ethMode = useWatch({
    control,
    name: "ethMode",
    defaultValue: Protobuf.Config_NetworkConfig_EthMode.DHCP
  });

  useEffect(() => {
    reset(config.network);
  }, [reset, config.network]);

  const onSubmit = handleSubmit((data) => {
    if (connection) {
      void toast.promise(
        connection
          .setConfig({
            config: {
              payloadVariant: {
                oneofKind: "network",
                network: Protobuf.Config_NetworkConfig.create(data)
              }
            }
          })
          .then(() =>
            setConfig({
              payloadVariant: {
                oneofKind: "network",
                network: data
              }
            })
          ),
        {
          loading: "Saving...",
          success: "Saved Network Config, Restarting Node",
          error: "No response received"
        }
      );
    }
  });

  return (
    <Form
      title="Network Config"
      breadcrumbs={["Config", "Network"]}
      reset={() => reset(config.network)}
      dirty={isDirty}
      onSubmit={onSubmit}
    >
      <ErrorMessage errors={errors} name="wifiEnabled" />
      <ErrorMessage errors={errors} name="wifiMode" />
      <ErrorMessage errors={errors} name="wifiSsid" />
      <ErrorMessage errors={errors} name="wifiPsk" />
      <ErrorMessage errors={errors} name="ntpServer" />
      <ErrorMessage errors={errors} name="ethEnabled" />
      <ErrorMessage errors={errors} name="ethMode" />
      <ErrorMessage errors={errors} name="ethConfig" />
      <ErrorMessage errors={errors} name="ip" />
      <ErrorMessage errors={errors} name="gateway" />
      <ErrorMessage errors={errors} name="subnet" />
      <ErrorMessage errors={errors} name="dns" />

      <FormSection title="WiFi Config">
        <Controller
          name="wifiEnabled"
          control={control}
          render={({ field: { value, ...rest } }) => (
            <Toggle
              label="Enabled"
              description="Enable or disable the WiFi radio"
              checked={value}
              {...rest}
            />
          )}
        />
        <Input
          label="SSID"
          description="Network name"
          error={errors.wifiSsid?.message}
          disabled={!wifiEnabled}
          {...register("wifiSsid", { disabled: !wifiEnabled })}
        />
        <Input
          label="PSK"
          type="password"
          description="Network password"
          error={errors.wifiPsk?.message}
          disabled={!wifiEnabled}
          {...register("wifiPsk", { disabled: !wifiEnabled })}
        />
      </FormSection>
      <FormSection title="Ethernet Config">
        <Controller
          name="ethEnabled"
          control={control}
          render={({ field: { value, ...rest } }) => (
            <Toggle
              label="Enabled"
              description="Enable or disbale the Ethernet port"
              checked={value}
              {...rest}
            />
          )}
        />
        <Select
          label="Ethernet Mode"
          description="Address assignment selection"
          disabled={!ethEnabled}
          {...register("ethMode", {
            valueAsNumber: true,
            disabled: !ethEnabled
          })}
        >
          {renderOptions(Protobuf.Config_NetworkConfig_EthMode)}
        </Select>
        {ethMode === Protobuf.Config_NetworkConfig_EthMode.STATIC && (
          <>
            <Input
              label="IP"
              type="number"
              description="IP Address"
              error={errors.ipv4Config?.ip?.message}
              {...register("ipv4Config.ip", { valueAsNumber: true })}
            />
            <Input
              label="Gateway"
              type="number"
              description="Default Gateway"
              error={errors.ipv4Config?.gateway?.message}
              {...register("ipv4Config.gateway", { valueAsNumber: true })}
            />
            <Input
              label="Subnet"
              type="number"
              description="Subnet Mask"
              error={errors.ipv4Config?.subnet?.message}
              {...register("ipv4Config.subnet", { valueAsNumber: true })}
            />
            <Input
              label="DNS"
              type="number"
              description="DNS Server"
              error={errors.ipv4Config?.dns?.message}
              {...register("ipv4Config.dns", { valueAsNumber: true })}
            />
          </>
        )}
      </FormSection>
      <Input
        label="NTP Server"
        description="NTP server for time synchronization"
        error={errors.ntpServer?.message}
        {...register("ntpServer")}
      />
    </Form>
  );
};
