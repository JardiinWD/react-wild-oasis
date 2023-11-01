import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";


function CreateCabinForm({ cabinToEdit }) {
  // Register function
  const { register, handleSubmit, reset, getValues, formState } = useForm()
  // Errors prop from every input
  const { errors } = formState

  const queryClient = useQueryClient()

  const {isLoading: isCreating, mutate} = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created')
      queryClient.invalidateQueries({queryKey: ["cabins"]})
      reset(); // React Form reset function
    },
    onError: (error) => toast.error(error.message)
  })


  /** Data Received onSubmit
   * @param {Object} data 
   */
  function onSubmitForm(data) {
    mutate({
      ...data,
      image: data.image[0]
    })
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
          disabled={isCreating} 
        />
      </FormRow>    

      <FormRow 
        errorMsg={errors?.maxCapacity?.message} 
        label='Maximum capacity'
      >
        <Input disabled={isCreating} type="number" id="maxCapacity" {...register(
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
        <Input disabled={isCreating} type="number" id="regularPrice" {...register(
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
        <Input disabled={isCreating} type="number" id="discount" defaultValue={0} {...register(
            'discount', {
              required: "This field is required",
              validate: (value) => value <= getValues().regularPrice || 'Discount should be less than regular price'
            }
          )} 
        />
      </FormRow>

      <FormRow
        errorMsg={errors?.description?.message} 
        label='Description for website'
        disabled={isCreating}
      >
        <Textarea disabled={isCreating} type="number" id="description" defaultValue="" {...register(
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
                required: "This field is required"
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
        <Button disabled={isCreating}>
          Add cabin
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
