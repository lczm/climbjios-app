import Iconify from 'src/components/Iconify';
import { useNavigate, useParams } from 'react-router-dom';
import JiosCreateEditForm from '../form/JiosCreateEditForm';
import { JioCreateEditFormValues, jioFormValuesToRequestJio } from '../form/utils';
import { useRequest } from 'ahooks';
import { useSnackbar } from 'notistack';
import { getJio, updateJio } from 'src/services/jios';
import { Jio } from 'src/@types/jio';
import { dateToTimeString } from '../../../../utils/formatTime';
import { PATH_DASHBOARD } from '../../../../routes/paths';

const jioToJioFormValues = (jio: Jio): JioCreateEditFormValues => ({
  type: jio.type,
  numPasses: jio.numPasses,
  price: jio.price,
  gymId: jio.gym.id,
  openToClimbTogether: jio.openToClimbTogether,
  optionalNote: jio.optionalNote,
  date: new Date(jio.startDateTime),
  // Time in 09:00 format
  startTiming: dateToTimeString(new Date(jio.startDateTime)),
  // Time in 09:00 format
  endTiming: dateToTimeString(new Date(jio.endDateTime)),
});

export default function JiosEdit() {
  const { id } = useParams();
  const jioId = Number(id);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data, error, loading } = useRequest(() => getJio(jioId), {
    onError: () => {
      enqueueSnackbar('Failed to get Jio.', { variant: 'error' });
    },
  });

  const navigateOut = () => {
    navigate(PATH_DASHBOARD.general.jios.userJios);
  };

  const { run: submitUpdateJio } = useRequest(updateJio, {
    manual: true,
    onSuccess: () => {
      enqueueSnackbar('Updated!');
      navigateOut();
    },
    onError: () => {
      enqueueSnackbar('Failed to update Jio.', { variant: 'error' });
    },
  });

  const handleEdit = async (data: JioCreateEditFormValues) => {
    if (isNaN(jioId)) {
      return;
    }

    submitUpdateJio(jioFormValuesToRequestJio(data), jioId);
  };

  return !data || error || loading ? null : (
    <JiosCreateEditForm
      onCancel={navigateOut}
      onSubmit={handleEdit}
      submitLabel="Submit"
      submitIcon={<Iconify icon={'eva:add-outline'} width={24} height={24} />}
      defaultValues={jioToJioFormValues(data.data)}
    />
  );
}
