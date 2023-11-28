import React from 'react'
import Stat from './Stat'
import {HiOutlineBanknotes, HiOutlineBriefcase, HiOutlineCalendarDays, HiOutlineChartBar} from 'react-icons/hi2'
import { formatCurrency } from '../../utils/helpers'


const Stats = ({ bookings, confirmedStays, numDays, cabinCount }) => {
    // 1. Number of bookings
    const numOfBookings = bookings.length
    // 2. Number of sales
    const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0)
    //3. Number of checkins
    const checkins = confirmedStays.length
    // 4. Number of occupation
    const occupation = confirmedStays.reduce((acc, cur) => acc + cur.numNights, 0) / (numDays * cabinCount)
    // console.log(occupation);

    return (
        <>
            <Stat 
                title='Bookings' 
                color='blue'
                icon={<HiOutlineBriefcase />} 
                value={numOfBookings} 
            />
            <Stat 
                title='Sales' 
                color='green'
                icon={<HiOutlineBanknotes />} 
                value={formatCurrency(sales)} 
            />
            <Stat 
                title='Check ins' 
                color='indigo'
                icon={<HiOutlineCalendarDays />} 
                value={checkins} 
            />
            <Stat 
                title='Occupancy rate' 
                color='yellow'
                icon={<HiOutlineChartBar />} 
                value={Math.round(occupation * 100)+ "%"} 
            />            
        </>
    )
}

export default Stats
