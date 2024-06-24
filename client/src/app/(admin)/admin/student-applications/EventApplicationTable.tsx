"use client";
import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import {
  CustomTableParams,
  EventApplicationTableParams,
  EventApplicationsTableData,
  HoursTableData,
  ProcessSubmissionParams,
} from "@/interfaces/interfaces";
import { isHoursTableData } from "@/app/_utils/typeChecker";
import { formatDate } from "@/app/_utils/DateFormatters";
import "../../../../components/Table/CustomTable.css";
import { useSession } from "next-auth/react";

const EventApplicationTable: React.FC<EventApplicationTableParams> = ({
  data,
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
    if (data) {
      setIsLoading(false);
    }
  }, [data]);
  type DataIndex = keyof EventApplicationsTableData;

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
  ): TableColumnType<EventApplicationsTableData> => ({
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
  const handleReview = async (
    record: EventApplicationsTableData,
    choice: string
  ) => {
    if (!session?.user) {
      console.log("session check failed");
      return;
    }

    // const body: ProcessSubmissionParams = {
    //   submissionId: Number(record.submissionId),
    //   updaterId: Number(session?.user.id),
    //   approvalStatus:
    //     choice === "approve"
    //       ? 1
    //       : choice === "deny"
    //       ? 2
    //       : choice === "pending"
    //       ? 0
    //       : 3,
    // };

    try {
      //   const response = await reviewHourSubmission(body);

      //   if (!response) {
      //     console.error("Response failed");
      //     return;
      //   }

      setEditingKey(null);

      console.log("DONE");
      return;
    } catch (error) {
      console.error("Error while reviewing submission:", error);
    }
  };

  const eventApplicationTableCols: TableColumnType<EventApplicationsTableData>[] =
    [
      {
        title: "Student Name",
        dataIndex: "studentName",
        key: "student_name",
        width: "25%",
        align: "center",
        render: (text: string, record: EventApplicationsTableData) => (
          <strong>{text}</strong>
        ),
        ...getColumnSearchProps("studentName"),
      },
      {
        title: "Event",
        dataIndex: "eventTitle",
        key: "event_title",
        width: "15%",
        align: "center",
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
        width: "10%",
        align: "center",
      },
      {
        title: "Spots Left",
        dataIndex: "estimatedParticipants", //render this so that it is estimatedParticipants - already accepted
        key: "spots_left",
        width: "5%",
        align: "center",
      },
      {
        title: "Date Applied",
        dataIndex: "dateApplied",
        key: "date_app;ied",
        width: "8%",
        align: "center",
      },
      {
        title: "Approval",
        dataIndex: "approvalStatus",
        key: "approval",
        width: "15rem%",
        align: "center",
        render: (text: string, record: EventApplicationsTableData) => {
          if (editingKey == Number(record.applicationId)) {
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
                  onClick={() => setEditingKey(Number(record.applicationId))}
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
                  onClick={() => setEditingKey(Number(record.applicationId))}
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

  return data ? (
    <Table
      columns={eventApplicationTableCols}
      dataSource={data}
      rowKey={(record) => record.key}
    />
  ) : (
    <>Error</>
  );
};

export default EventApplicationTable;
