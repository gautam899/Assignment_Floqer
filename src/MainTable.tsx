/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import Papa from 'papaparse';
import LineGraph from './components/LineGraph';
import JobTitlesTable from './components/JobTitlesTable';
import { Row, Col, Typography, Card } from 'antd';

const { Title } = Typography;

//First we will create the interface in typescript to type the salary data.
export interface SalaryData {
    work_year: number;
    experience_level: string;
    employment_type: string;
    job_title: string;
    salary: number;
    salary_currency: string;
    salary_in_usd: number;
    employee_residence: string;
    remote_ratio: number;
    company_location: string;
    company_size: string;
}


const MainTable: React.FC = () => {
    //To store the data that we want to display we need a state variable.
    const [data, setData] = useState<SalaryData[]>([]);

    //To handle click on the table row we need to keep a state to keep track of the
    //year that we are clicking on
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    //Now as our component will mount we need to fetch the CSV file.
    //To do that we need a useEffect hook to fetch the data.
    useEffect(() => {
        // Fetch and parse the CSV file and store the data in the CSV file.

        //1. Create HTTP request to fetch the CSV file.
        fetch('/salaries.csv')
            //convert the file into plain text.
            .then(response => response.text())
            //Now we use papaparse to parse the text response.
            .then(csvText => {
                // Inside papaparse we need to add some configuration.
                //header:true means that the first row in the text is header
                //dynamicTyping convert the numeric values to number instead of string.
                //At last once the parsing complete a call back function is executed
                //which sets the parsed data into data state variable.
                Papa.parse<SalaryData>(csvText, {
                    header: true,
                    dynamicTyping: true,
                    complete: (results) => {
                        setData(results.data);
                    },
                });
            });
    }, []);
    const handleRowClick = (year: number) => {
        setSelectedYear(year);
    }
    // Once data has been parses now we want to process it.
    // We will use the reduce method to iterate over data array.
    // The acc ie. the accumalator starts as an empty object which will store
    //aggregated data for each year.
    const processedData = data.reduce((acc, curr) => {
        //Extract the work year property.
        const year = curr.work_year;
        //If the accumulator does not already have the entry for 
        //the current year, create a new entry.
        if (!acc[year]) {
            acc[year] = { year, totalJobs: 0, totalSalary: 0 };
        }
        //increment the job and the salary for that year.
        acc[year].totalJobs += 1;
        acc[year].totalSalary += curr.salary_in_usd;
        return acc;
    }, {} as Record<number, { year: number; totalJobs: number; totalSalary: number }>);

    const tableData = Object.values(processedData).map(item => ({
        year: item.year,
        totalJobs: item.totalJobs,
        avgSalary: item.totalSalary / item.totalJobs,
    }));

    const columns = [
        { title: 'Year', dataIndex: 'year', key: 'year', sorter: (a: any, b: any) => a.year - b.year },
        { title: 'Total Jobs', dataIndex: 'totalJobs', key: 'totalJobs', sorter: (a: any, b: any) => a.totalJobs - b.totalJobs },
        { title: 'Average Salary (USD)', dataIndex: 'avgSalary', key: 'avgSalary', sorter: (a: any, b: any) => a.avgSalary - b.avgSalary },
    ];

    return (
        <div className='mx-auto max-sm:w-full'>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={2} style={{ textAlign: 'center', marginTop: "20px", marginBottom: '20px', fontSize: "35px", fontStyle: "bold" }}>
                        Task 1: Main Table
                    </Title>
                    <Card>
                        <Table
                            dataSource={tableData}
                            columns={columns}
                            rowKey="year"
                            onRow={(record) => ({

                                onClick: () => {
                                    handleRowClick(record.year);
                                    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
                                }
                            })}
                        />
                    </Card>
                </Col>
            </Row>

            <Row justify="center" style={{ marginTop: '20px' }}>
                <Col>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', fontSize: "35px", fontStyle: "bold" }}>
                        Task 2: A Line Graph
                    </Title>
                    <Card>
                        <LineGraph data={tableData} />
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col span={24}>
                    {selectedYear && (
                        <Card>
                            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', fontSize: "35px", fontStyle: "bold" }}>
                                Task 3
                            </Title>
                            <JobTitlesTable year={selectedYear} data={data} />
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default MainTable;
