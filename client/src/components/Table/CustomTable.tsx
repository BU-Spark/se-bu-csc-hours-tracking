"use client";
import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import {
  CustomTableParams,
  HoursTableData,
  ProcessSubmissionParams,
} from "@/interfaces/interfaces";
import { isHoursTableData } from "@/app/_utils/typeChecker";
import { formatDate } from "@/app/_utils/DateFormatters";
import "./CustomTable.css";
import { reviewHourSubmission } from "@/app/(admin)/admin/student-hours/action";
import { useSession } from "next-auth/react";

const CustomTable: React.FC<CustomTableParams> = ({ data, dataType }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [loading, setIsLoading] = useState<boolean>(true);
  const searchInput = useRef<InputRef>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);
  let cols = [];
  type DataIndex = keyof HoursTableData;

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<HoursTableData> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    onCell: (record) => ({
      style: {
        maxWidth: 200,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    }),
  });

  // FOR APPROVING / DENYING HOURS
  const handleReview = async (record: HoursTableData, choice: string) => {
    if (!session?.user) {
      console.log("session check failed");
      return;
    }
    console.log("choice", choice);
    const body: ProcessSubmissionParams = {
      submissionId: Number(record.submissionId),
      updaterId: Number(session?.user.id),
      approvalStatus: choice == "approve" ? 1 : choice == "deny" ? 2 : 3,
    };
    const choose = async () => {
      const response = await reviewHourSubmission(body);
      return response;
    };
    const worked = choose();

    if (!worked) {
      console.error("Response failed");
      return;
    }
  };

  const hourSubmissionsTableCols: TableColumnType<HoursTableData>[] = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "student_name",
      width: "25%",
      align: "center",
      render: (text: string, record: HoursTableData) => <strong>{text}</strong>,
      ...getColumnSearchProps("studentName"),
    },
    {
      title: "College",
      dataIndex: "college",
      key: "college",
      width: "10%",
      align: "center",
      ...getColumnSearchProps("college"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "10%",
      align: "center",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Date Submitted",
      dataIndex: "dateSubmitted",
      key: "dateSubmitted",
      width: "20%",
      align: "center",
      render: (text: string, record: HoursTableData) =>
        new Date(record.dateSubmitted).toLocaleDateString("en-US"),
      ...getColumnSearchProps("dateSubmitted"),
    },
    {
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
      width: "8%",
      align: "center",
      ...getColumnSearchProps("hours"),
    },
    {
      title: "Approval",
      dataIndex: "approvalStatus",
      key: "approval",
      width: "37%",
      align: "center",
      render: (text: string, record: HoursTableData) => {
        return record.approvalStatus == 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "80%",
              margin: "0 auto",
            }}
          >
            <button
              className="approve-buttons"
              onClick={() => handleReview(record, "approve")}
            >
              Approve
            </button>
            <button
              className="approve-buttons"
              onClick={() => handleReview(record, "deny")}
            >
              Deny
            </button>
          </div>
        ) : record.approvalStatus == 1 ? (
          <p>
            Approved by <b>{record.updatedBy}</b>
          </p>
        ) : record.approvalStatus == 2 ? (
          <p>
            Denied by <b>{record.updatedBy}</b>
          </p>
        ) : (
          <p>Unidentified submission code</p>
        );
      },
    },
  ];

  if (loading) {
    return <p>Loading...</p>;
  }

  return data ? (
    <Table
      columns={hourSubmissionsTableCols}
      dataSource={data}
      rowKey={(record) => record.key}
    />
  ) : (
    <>No data</>
  );
};

export default CustomTable;
