"use client";

import "./CustomTable.css";
import React, { useEffect, useRef, useState } from "react";
import { DownOutlined, SearchOutlined, UpOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import {
  CustomTableParams,
  EventApplicationsTableData,
  HoursTableData,
  ProcessSubmissionParams,
  StudentDropdown,
} from "@/interfaces/interfaces";
import { isHoursTableData } from "@/app/_utils/typeChecker";
import { formatDate } from "@/app/_utils/DateFormatters";
import { reviewHourSubmission } from "@/app/(admin)/admin/student-hours/action";
import { useSession } from "next-auth/react";
import { buRed } from "@/_common/styles";

const CustomTable: React.FC<CustomTableParams> = ({
  data: dataInput,
  set1,
  val1,
  set2,
  val2,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [loading, setIsLoading] = useState<boolean>(true);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const searchInput = useRef<InputRef>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (dataInput) {
      setIsLoading(false);
    }
  }, [dataInput]);
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
      <SearchOutlined style={{ color: filtered ? "white" : "white" }} />
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

    const body: ProcessSubmissionParams = {
      submissionId: Number(record.submissionId),
      updaterId: Number(session?.user.id),
      approvalStatus:
        choice === "approve"
          ? 1
          : choice === "deny"
          ? 2
          : choice === "pending"
          ? 0
          : 3,
    };

    try {
      const response = await reviewHourSubmission(body);

      if (!response) {
        console.error("Response failed");
        return;
      }

      setEditingKey(null);

      if (set1 && val1 && set2 && val2) {
        if (choice === "pending") {
          // Update record approvalStatus and move to val1
          const updatedRecord = { ...record, approvalStatus: 0 };
          set1([updatedRecord, ...val1]);
          set2(val2.filter((val) => val.submissionId !== record.submissionId));
        } else if (choice === "approve" || choice === "deny") {
          // Update record approvalStatus and move to val2
          const updatedRecord = {
            ...record,
            approvalStatus: choice === "approve" ? 1 : 2,
          };
          set2([
            updatedRecord,
            ...val2.filter((val) => val.submissionId !== record.submissionId),
          ]);
          set1(val1.filter((val) => val.submissionId !== record.submissionId));
        } else {
          console.error("Invalid choice");
        }
      }
    } catch (error) {
      console.error("Error while reviewing submission:", error);
    }
  };

  const StudentDropdown: React.FC<StudentDropdown> = ({ record }) => {
    const [toggled, setToggled] = useState<boolean>(false);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <strong>{record.studentName}</strong>
          <button
            onClick={() => setToggled(!toggled)}
            style={{
              borderRadius: "15px",
              backgroundColor: !toggled ? "white" : buRed,
              margin: "0 1rem",
              color: !toggled ? "black" : "white",
            }}
          >
            {" "}
            {!toggled ? (
              <DownOutlined style={{ fontSize: "1rem" }} />
            ) : (
              <UpOutlined
                color="white !important"
                style={{ fontSize: "1rem" }}
              />
            )}
          </button>
        </div>

        {toggled ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start", // Align items to the start (top) of the container
              fontSize: "0.75rem",
              width: "90%",
              wordWrap: "break-word",
              whiteSpace: "normal",
              margin: "1rem 0",
            }}
          >
            <p style={{ flexWrap: "wrap" }}>{record.description}</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const hourSubmissionsTableCols: TableColumnType<HoursTableData>[] = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "student_name",
      width: "25%",
      align: "center",

      render: (text: string, record: HoursTableData) => {
        return <StudentDropdown record={record} />;
      },
      ...getColumnSearchProps("studentName"),
    },
    {
      title: "BU ID",
      dataIndex: "buId",
      key: "bu_id",
      width: "10%",
      align: "center",

      ...getColumnSearchProps("studentName"),
    },
    {
      title: "College",
      dataIndex: "college",
      key: "college",
      width: "5%",
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
      width: "15%",
      align: "center",

      render: (text: string, record: HoursTableData) =>
        new Date(record.dateSubmitted).toLocaleDateString("en-US"),
      ...getColumnSearchProps("dateSubmitted"),
      // sorter: (a: HoursTableData, b: HoursTableData) => {
      //   const dateA = new Date(a.dateSubmitted).getTime();
      //   const dateB = new Date(b.dateSubmitted).getTime();
      //   return dateA - dateB;
      // },
      defaultSortOrder: "ascend",
    },
    {
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
      width: "8%",
      align: "center",
    },
    {
      title: "Approval",
      dataIndex: "approvalStatus",
      key: "approval",
      width: "15rem%",
      align: "center",
      render: (text: string, record: HoursTableData) => {
        if (editingKey == Number(record.submissionId)) {
          return (
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
                onClick={() => handleReview(record, "pending")}
              >
                Pending
              </button>
              {record.approvalStatus == 1 ? (
                <button
                  className="approve-buttons"
                  onClick={() => handleReview(record, "deny")}
                >
                  Deny
                </button>
              ) : (
                <button
                  className="approve-buttons"
                  onClick={() => handleReview(record, "approve")}
                >
                  Approve
                </button>
              )}
              <a
                style={{
                  textDecoration: "underline",
                  color: "grey",
                  marginLeft: "10px",
                }}
                onClick={() => setEditingKey(null)}
              >
                Cancel
              </a>
            </div>
          );
        }

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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <p style={{ marginBottom: 0 }}>Approved by</p>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <b>{record.updatedBy}</b>
              <a
                style={{
                  textDecoration: "underline",
                  color: "grey",
                  marginLeft: "10px",
                }}
                onClick={() => setEditingKey(Number(record.submissionId))}
              >
                Change
              </a>
            </div>
          </div>
        ) : record.approvalStatus == 2 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <p style={{ marginBottom: 0 }}>Denied by</p>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <b>{record.updatedBy}</b>
              <a
                style={{
                  textDecoration: "underline",
                  color: "grey",
                  marginLeft: "10px",
                }}
                onClick={() => setEditingKey(Number(record.submissionId))}
              >
                Change
              </a>
            </div>
          </div>
        ) : (
          <p>Unidentified submission code</p>
        );
      },
    },
  ];

  if (loading) {
    return <p>Loading...</p>;
  }

  return dataInput ? (
    <Table
      columns={hourSubmissionsTableCols}
      dataSource={dataInput}
      rowKey={(record) => record.key}
      locale={{
        emptyText: "No records found",
        filterEmptyText: "No records found that match this filter",
      }}
    />
  ) : (
    <>No data</>
  );
};

export default CustomTable;
