import * as React from 'react';
import { useCallback } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
// @mui
import { Box, Typography, Stack, InputAdornment } from '@mui/material';
// components
import {
  FormProvider,
  RHFTextField,
  RHFRadioGroup,
  RHFSlider,
  RHFSelect,
  RHFDatePicker,
} from '../../../components/hook-form';
// form
import { useForm } from 'react-hook-form';
// @types
import { Jio } from '../../../@types/jio';
import { Gym } from '../../../@types/gym';
// dayjs
import { getGymList } from 'src/services/gyms';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { useRequest } from 'ahooks';

// ----------------------------------------------------------------------

const JIOTYPE_OPTION = [
  { label: "I'm buying", value: 'buyer' },
  { label: "I'm selling", value: 'seller' },
  { label: 'None, just looking for friends to climb with', value: 'other' },
];

const NewJioSchema = Yup.object().shape({
  type: Yup.string().required('Looking to buy or sell passes is required'),
  numPasses: Yup.number().required('Number of passes is required').positive().integer(),
  price: Yup.number().required('Price is required').positive('Price must be more than $0'),
  gymId: Yup.number().required('Gym is required').positive().integer(),
  date: Yup.date().required('Date is required'),
  startDateTime: Yup.string().required('Start timing is required'),
  endDateTime: Yup.string().required('End timing is required'),
  openToClimbTogether: Yup.boolean().required(),
});

// ----------------------------------------------------------------------

export interface JioFormValues {
  type: Jio['type'];
  numPasses: Jio['numPasses'];
  price: Jio['price'];
  gymId: Jio['gymId'];
  openToClimbTogether: Jio['openToClimbTogether'];
  optionalNote: Jio['optionalNote'];
  date: Date;
  // Time in 09:00 format
  startDateTime: string;
  // Time in 09:00 format
  endDateTime: string;
}

type Props = {
  onSubmit: (data: JioFormValues) => Promise<void>;
  submitIcon: React.ReactElement;
  submitLabel: string;
  isSearch?: boolean;
  defaultValues?: JioFormValues;
};

export default function JiosForm({
  onSubmit,
  defaultValues: currentJio,
  isSearch,
  submitIcon,
  submitLabel,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { data: gymsData, loading: loadingGyms } = useRequest(getGymList, {
    onError: () => {
      enqueueSnackbar('Failed to fetch gyms', { variant: 'error' });
    },
  });

  const initialFormValues = useMemo(
    () => ({
      type: currentJio?.type, // Change to enum
      numPasses: currentJio?.numPasses || 1,
      price: currentJio?.price,
      gymId: currentJio?.gymId,
      date: currentJio?.date || new Date(),
      startDateTime: currentJio?.startDateTime || '09:00',
      endDateTime: currentJio?.endDateTime || '22:00',
      openToClimbTogether: currentJio?.openToClimbTogether,
    }),
    [currentJio]
  );

  const methods = useForm<JioFormValues>({
    resolver: yupResolver(NewJioSchema),
    defaultValues: initialFormValues,
  });

  const { handleSubmit, setError, watch } = methods;

  const submitForm = async (data: JioFormValues) => {
    // TODO: do a check for start date time must be after now
    if (data.startDateTime >= data.endDateTime) {
      setError('startDateTime', { type: 'custom', message: 'Start time must be before end time' });
      return;
    }

    try {
      await onSubmit(data);
    } catch (error) {
      enqueueSnackbar('Failed to submit form', { variant: 'error' });
    }
  };

  if (process.env.REACT_APP_DEBUG_FORM === 'true') {
    const formData = watch();
  }

  return (
    <Box
      sx={{
        pt: 5,
        pb: 20,
        px: '15px',
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3}>
          <Typography sx={{ mb: -1 }} variant="subtitle1">
            Are you looking to buy or sell passes?
          </Typography>
          <RHFRadioGroup name="type" options={JIOTYPE_OPTION} color="primary" />

          <Typography variant="subtitle1" sx={{ pb: 1 }}>
            How many passes are you looking to buy?
          </Typography>
          <RHFSlider
            name="numPasses"
            step={1}
            min={1}
            max={8}
            valueLabelDisplay="on"
            color="primary"
            sx={{ alignSelf: 'center', width: `calc(100% - 20px)` }}
          />

          {/* Don't show pass price for search */}
          {!isSearch && (
            <>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                How much are you willing to pay for a pass?
              </Typography>
              <RHFTextField
                size="medium"
                type="number"
                name="price"
                label="Price"
                placeholder="0"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ maxWidth: { md: 96 } }}
              />
            </>
          )}

          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
            Where are you climbing at?
          </Typography>
          <RHFSelect
            label="Select Gym"
            fullWidth
            name="gymId"
            SelectProps={{ native: true }}
            defaultValue=""
          >
            {/* Disabled Option for first option to not auto-render */}
            <option value="" disabled />
            {loadingGyms
              ? []
              : gymsData?.data.map((gym: Gym) => (
                  <option key={gym.id} value={gym.id}>
                    {gym.name}
                  </option>
                ))}
          </RHFSelect>

          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
            What date are you climbing on?
          </Typography>
          <RHFDatePicker name="date" label="Date" />

          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
            What time are you climbing at?
          </Typography>
          <Stack justifyContent="space-evenly" direction="row" spacing={2} sx={{ mt: 3 }}>
            <RHFTextField
              size="medium"
              type="time"
              name="startDateTime"
              label="Start Time"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <RHFTextField
              size="medium"
              type="time"
              name="endDateTime"
              label="End Time"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Stack>

          <Typography sx={{ mb: '-8px' }} variant="subtitle1">
            Are you open to climbing with others?
          </Typography>
          <RHFRadioGroup
            name="openToClimbTogether"
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ]}
            color="primary"
          />

          {/* Don't show optionalNote for search */}
          {!isSearch && (
            <>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                Anything else you want to mention? (Optional)
              </Typography>
              <RHFTextField
                size="medium"
                multiline
                rows={3}
                name="optionalNote"
                label=""
                placeholder=""
                sx={{ maxWidth: { md: 96 } }}
              />
            </>
          )}

          <LoadingButton
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            startIcon={submitIcon}
          >
            <Typography variant="button">{submitLabel}</Typography>
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Box>
  );
}
