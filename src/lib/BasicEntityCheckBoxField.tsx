import React, { useEffect, forwardRef } from "react";

import {
  FormControlLabel,
  Checkbox,
  Box
} from "@mui/material";
import { Controller } from "react-hook-form";


function BasicEntityCheckBoxField(props: any) {
  const { spec } = props;

  const { field, getValues, control } = spec;
  const val = getValues(field.name);

  return (
    <Box
      key={field.id}
      display="flex"
      justifyContent={field.ux.justifyContent || "center"}
      alignItems={field.ux.alignItems || "center"}
      height={field.ux.height || "auto"}
    >
      <FormControlLabel
        control={
          <Controller
            name={field.name}
            control={control}
            defaultValue={!!val}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                id={field.id}
                checked={value}
                onChange={onChange}
                disabled={!field.ux.edit}
                required={field.ux.required || false}
              />
            )}
          />
        }
        label={field.label}
      />
    </Box>
  );
}

export { BasicEntityCheckBoxField };