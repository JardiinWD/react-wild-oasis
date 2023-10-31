import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";
import FormRow from "../../ui/FormRow";

const FormRow2 = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function CreateCabinForm() {
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
    mutate(data)
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
        <FileInput id="image" accept="image/*"  />
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
