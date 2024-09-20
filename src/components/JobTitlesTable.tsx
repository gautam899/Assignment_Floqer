/* eslint-disable @typescript-eslint/no-unused-vars */
// Here we will be displaying the aggregated Job Titles 
//and total job for that year

import React from "react";
import { Table } from "antd";
import { SalaryData } from "../MainTable";

//We will accepting some props so we need to define there type in form 
//of a interface before accepting it

interface JobTitlesTableProps {
    year: number;
    data: SalaryData[],
}
const JobTitlesTable: React.FC<JobTitlesTableProps> = ({ year, data }) => {
    const filteredData = data.filter(d => d.work_year === year)
    const jobTitleCount = filteredData.reduce((acc, curr) => {
        acc[curr.job_title] = (acc[curr.job_title] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    //lets now define the table data 
    const tableData = Object.entries(jobTitleCount).map(([jobTitle, count]) => (
        {
            jobTitle,
            count,
        }
    ));
    //the columns in the table that we will have.
    const columns = [
        { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle' },
        { title: 'Count', dataIndex: 'count', key: 'count' }
    ];
    return <Table dataSource={tableData} columns={columns} rowKey="jobTitle"/>
}

export default JobTitlesTable;