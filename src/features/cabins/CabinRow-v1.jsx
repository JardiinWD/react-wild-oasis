import styled from "styled-components";
import { formatCurrency } from '../../utils/helpers'
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./useDeleteCabin";
import {
  HiOutlineSquare2Stack,
  HiOutlineTrash,
  HiPencilSquare,
} from "react-icons/hi2";
import { useCreateCabin } from "./useCreateCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";


const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

const CabinRow = ({ cabin }) => {
  // Import from custom hook
  const { isDeleting, deleteCabin } = useDeleteCabin()
  // Duplicate a cabin hook
  const {isCreating, createCabin} = useCreateCabin() 

  // Destructuring of Cabin prop
  const {
    name, 
    maxCapacity, 
    regularPrice, 
    discount, 
    image,
    description,
    id: cabinId
  } = cabin

  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity, 
      regularPrice, 
      discount, 
      image,
      description
    })
  }


  return (
      <Table.Row>
        <Img src={image} />
        <Cabin>{name}</Cabin>
        <div>Fits up the {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? (<Discount>{formatCurrency(discount)}</Discount>) : (<span>&mdash;</span>)}
        <div>
          {/* Duplicate Cabin */}
          <button onClick={handleDuplicate} disabled={isCreating}>
            <HiOutlineSquare2Stack />
          </button>
          <Modal>
            {/* Edit Cabin */}
            <Modal.Open opens="edit">
              <button>
                <HiPencilSquare />
              </button>
            </Modal.Open>
            <Modal.Window name="edit">
              <CreateCabinForm cabinToEdit={cabin} />  
            </Modal.Window>
            {/* Delete Cabin */}
            <Modal.Open opens="delete">
              <button>
                <HiOutlineTrash />
              </button>
            </Modal.Open>
            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="cabins"
                disabled={isDeleting}
                onConfirm={() => deleteCabin(cabinId)}
              />
            </Modal.Window>
          </Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabinId} />
            <Menus.List id={cabinId}>
              <Menus.Button icon={<HiOutlineSquare2Stack />} onClick={handleDuplicate}>Duplicate</Menus.Button>
              <Menus.Button icon={<HiPencilSquare />}>Edit</Menus.Button>
              <Menus.Button icon={<HiOutlineTrash />}>Delete</Menus.Button>
            </Menus.List>
          </Menus.Menu>
        </div>
      </Table.Row>
  )
}

export default CabinRow
