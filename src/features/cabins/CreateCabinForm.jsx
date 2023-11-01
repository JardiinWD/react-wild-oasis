import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";


function CreateCabinForm({ cabinToEdit = {} }) {

  // == MUTATE FUNCTIONS ==
  const { isCreating, createCabin } = useCreateCabin()
  const { isEditing , editCabin} = useEditCabin()
  // Variables for checking user status
  const isWorking = isCreating || isEditing

   // == PROPS ==
  const {
    id: editId, // Received via props the ID on every rows
    ...editValues // Other values of the item row
  } = cabinToEdit
  // Check if we are editing or creating 
  const isEditSession = Boolean(editId)

  // == react-hook-form HANDLING  ==

  // useForm function
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {}
  })
  // Errors proprerty from every input field
  const { errors } = formState

  /**
   * Gestione dei dati ricevuti al momento della presentazione
   * @param {Object} data - I dati ricevuti dal modulo
   */
  function onSubmitForm(data) {
    // Verifica i dati dell'immagine
    const image = typeof data.image === 'string' ? data.image : data.image[0];

    // Se gli utenti stanno modificando i dati
    if (isEditSession) {
      // Chiama la funzione di modifica della cabina
      editCabin(
        {
          newCabinData: {
            ...data,
            image
          },
          id: editId
        },
        {
          onSuccess : () => {
            reset()
          }
        }
      );
    } 
    // Se gli utenti stanno creando nuovi dati
    else {
      // Chiama la funzione di creazione della cabina
      createCabin(
        {
          ...data,
          image: image
        },
        {
          onSuccess : () => {
            reset()
          }
        }
      );
    }
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmitForm, onError)}>
      <FormRow 
        errorMsg={errors?.name?.message} 
        label='Cabin name'
      >
        <Input 
          type="text" 
          id="name" 
            {...register(
              'name', {
                required: "This field is required",
              }
            )}
          disabled={isWorking} 
        />
      </FormRow>    

      <FormRow 
        errorMsg={errors?.maxCapacity?.message} 
        label='Maximum capacity'
      >
        <Input disabled={isWorking} type="number" id="maxCapacity" {...register(
            'maxCapacity', {
              required: "This field is required",
              min: {
                value: 1,
                message: "Capacity should be at least 1"
              }
            }
          )} 
        />
      </FormRow>

      <FormRow 
        errorMsg={errors?.regularPrice?.message} 
        label='Regular price'
      >
        <Input disabled={isWorking} type="number" id="regularPrice" {...register(
            'regularPrice', {
              required: "This field is required",
              min: {
                value: 1,
                message: "Capacity should be at least 1"
              }
            }
          )} 
        />
      </FormRow>

      <FormRow 
        errorMsg={errors?.discount?.message} 
        label='Discount'
      >
        <Input disabled={isWorking} type="number" id="discount" defaultValue={0} {...register(
            'discount', {
              required: "This field is required",
              validate: (value) => value < getValues().regularPrice || 'Discount should be less than regular price'
            }
          )} 
        />
      </FormRow>

      <FormRow
        errorMsg={errors?.description?.message} 
        label='Description for website'
        disabled={isWorking}
      >
        <Textarea disabled={isWorking} type="text" id="description" defaultValue="" {...register(
            'description', {
              required: "This field is required"
            }
          )} 
        />
      </FormRow>

      <FormRow
        label='Cabin photo'
      >
        <FileInput 
          id="image"
          accept="image/*" 
          {...register(
              'image', {
                required: isEditSession ? false : "This field is required"
              }
            )
          }   
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? 'Edit Cabin' : 'Create cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
