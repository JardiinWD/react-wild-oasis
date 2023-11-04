import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import { useEditSettings } from './useEditSettings';
import { useSettings } from './useSettings';

function UpdateSettingsForm() {

  const {
    isLoading, 
    settings : {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {}
  } = useSettings()

  const { isUpdating, updateSetting } = useEditSettings()

  if (isLoading) return <Spinner />

  function handleUpdate(e, field) {
    const {value} = e.target;
    if (!value) return;
    updateSetting({
      [field]: value
    })
  }

  return (
    <Form>
      <FormRow label='Minimum nights/booking'>
        <Input disabled={isUpdating} type='number' id='min-nights' defaultValue={minBookingLength} onBlur={e => handleUpdate(e, 'minBookingLength')} />
      </FormRow>

      <FormRow label='Maximum nights/booking'>
        <Input disabled={isUpdating} type='number' id='max-nights' defaultValue={maxBookingLength}  onBlur={e => handleUpdate(e, 'maxBookingLength')} />
      </FormRow>

      <FormRow label='Maximum guests/booking'>
        <Input disabled={isUpdating} type='number' id='max-guests' defaultValue={maxGuestsPerBooking} onBlur={e => handleUpdate(e, 'maxGuestsPerBooking')} />
      </FormRow>

      <FormRow label='Breakfast price'>
        <Input disabled={isUpdating} type='number' id='breakfast-price' defaultValue={breakfastPrice} onBlur={e => handleUpdate(e, 'breakfastPrice')} />
      </FormRow>

    </Form>
  );
}

export default UpdateSettingsForm;
