import * as React from 'react';
import { Button, Card, CardHeader, Stack, Typography } from '@mui/material';
import Iconify from '../../../../../components/Iconify';
import { IconStyle } from 'src/utils/common';
import { Jio } from '../../../../../@types/jio';
import palette from '../../../../../theme/palette';
import { formatStartEndDate } from '../../../../../utils/formatTime';
import { getPassesText } from '../utils';

interface JioCardProps {
  data: Jio;
}

export default function JioCard({ data }: JioCardProps) {
  return (
    <Card>
      <CardHeader title={data.creatorProfile.name} subheader={`@${data.creatorProfile.name}`} />
      <Stack spacing={1.5} sx={{ px: 3, pb: 3, pt: 2 }}>
        <Stack direction="row">
          <IconStyle icon={'eva:pin-outline'} color={palette.light.grey[700]} />
          <Typography variant="body2">{data.gym.name}</Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={'eva:calendar-outline'} color={palette.light.grey[700]} />
          <Typography variant="body2">
            {formatStartEndDate(data.startDateTime, data.endDateTime)}
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={'mingcute:coupon-line'} color={palette.light.grey[700]} />
          <Typography variant="body2">{getPassesText(data)}</Typography>
        </Stack>
        {Boolean(data.price) && (
          <Stack direction="row">
            <IconStyle icon={'eva:pricetags-outline'} color={palette.light.grey[700]} />
            <Typography variant="body2">{`$${data.price}/pass`}</Typography>
          </Stack>
        )}
        {data.openToClimbTogether && (
          <Stack direction="row">
            <IconStyle icon={'fluent:hand-wave-16-regular'} color={palette.light.grey[700]} />
            <Typography variant="body2">Open Jio to climb together!</Typography>
          </Stack>
        )}
        {data.optionalNote && (
          <Stack direction="row">
            <IconStyle icon={'eva:message-square-outline'} color={palette.light.grey[700]} />
            <Typography variant="body2">{data.optionalNote}</Typography>
          </Stack>
        )}
        <Stack direction="row">
          <Button
            sx={{ mt: 1 }}
            color="secondary"
            fullWidth
            href={`https://t.me/${data.creatorProfile.telegramHandle}`}
            variant="outlined"
            target="_blank"
            rel="noopener"
          >
            <Iconify icon={'jam:telegram'} sx={{ mr: 1 }} />
            <span>Message on Telegram</span>
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
