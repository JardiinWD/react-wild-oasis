import React from 'react'
import Select from './Select'
import { useSearchParams } from 'react-router-dom'

const SortBy = ({ options }) => {
  // get searchParams hook
  const [searchParams, setSearchParams] = useSearchParams()
  // default value on reload
  const sortBy = searchParams.get('sortBy') || ''

  function handleChange(e) {
    // Set search params with e.value
    searchParams.set('sortBy', e.target.value)
    //update searchParams value
    setSearchParams(searchParams)
  }

  return (
    <Select options={options} type="white" onChange={handleChange} value={sortBy} />
  )
}

export default SortBy
