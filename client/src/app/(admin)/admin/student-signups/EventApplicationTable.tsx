"use client";
import "./EventApplicationTable.css";
import "../../../../components/Table/CustomTable.css";
import React, { useEffect, useRef, useState } from "react";
import { DownOutlined, SearchOutlined, UpOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import {
  CustomTableParams,
  EventApplicationTableParams,
  EventApplicationsTableData,
  HoursTableData,
  ProcessSubmissionParams,
  SpotsLeftProps,
} from "@/interfaces/interfaces";
import { isHoursTableData } from "@/app/_utils/typeChecker";
import { formatDate } from "@/app/_utils/DateFormatters";
import { useUser } from '@clerk/nextjs';
import { getEventSpotsLeft, reviewEventApplication } from "./action";
import { text } from "stream/consumers";
import { buRed } from "@/_common/styles";
;

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
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  // component used later for spots left column
  const SpotsLeft: React.FC<SpotsLeftProps> = ({ eventId }) => {
    const [spotsLeft, setSpotsLeft] = useState<number | undefined>(undefined);

    useEffect(() => {
      const fetchSpotsLeft = async () => {
        const spots: number | undefined = await getEventSpotsLeft(eventId);
        setSpotsLeft(spots);
      };

      fetchSpotsLeft();
    }, [eventId]);

    if (spotsLeft === undefined) {
      return "Loading...";
    }

    return (
      <p style={{ color: spotsLeft < 0 ? buRed : "black" }}>{spotsLeft}</p>
    );
  };

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


    const body: ProcessSubmissionParams = {
      submissionId: Number(record.applicationId),
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
      const response = await reviewEventApplication(body);

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
          set2(
            val2.filter((val) => val.applicationId !== record.applicationId)
          );
        } else if (choice === "approve" || choice === "deny") {
          // Update record approvalStatus and move to val2
          const updatedRecord = {
            ...record,
            approvalStatus: choice === "approve" ? 1 : 2,
          };
          set2([
            updatedRecord,
            ...val2.filter((val) => val.applicationId !== record.applicationId),
          ]);
          set1(
            val1.filter((val) => val.applicationId !== record.applicationId)
          );
        } else {
          console.error("Invalid choice");
        }
      }

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
        width: "20%",
        align: "center",
        render: (text: string, record: EventApplicationsTableData) => (
          <strong>{text}</strong>
        ),
        ...getColumnSearchProps("studentName"),
      },
      {
        title: "BU ID",
        dataIndex: "buId",
        key: "bu_id",
        width: "10%",
        align: "center",
      },
      {
        title: "Event",
        dataIndex: "eventTitle",
        key: "event_title",
        width: "10%",
        align: "center",
        ...getColumnSearchProps("eventTitle"),
        render: (text: string, record: EventApplicationsTableData) => {
          return (
            <a href={`/admin/events/${record.eventId}`}>{record.eventTitle}</a>
          );
        },
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
        width: "15%",
        align: "center",
        render: (eventId: number, record: EventApplicationsTableData) => {
          return <p>{record.reason.meaning}</p>;
        },
      },
      {
        title: "Spots Left",
        dataIndex: "id", // We'll use the event id to fetch the spots left
        key: "spots_left",
        width: "5%",
        align: "center",
        render: (eventId: number, record: EventApplicationsTableData) => {
      

          return <SpotsLeft eventId={Number(record.eventId)} />;
        },
      },
      {
        title: "Date Applied",
        dataIndex: "dateApplied",
        key: "date_applied",
        width: "15%",
        align: "center",
        // sorter: (
        //   a: EventApplicationsTableData,
        //   b: EventApplicationsTableData
        // ) => {
        //   const dateA = new Date(a.dateApplied).getTime();
        //   const dateB = new Date(b.dateApplied).getTime();
        //   return dateA - dateB;
        // },
        defaultSortOrder: "ascend",
        render: (text: string, record: EventApplicationsTableData) =>
          new Date(record.dateApplied).toLocaleDateString("en-US"),
        ...getColumnSearchProps("dateApplied"),
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
      locale={{
        emptyText: "No records found",
        filterEmptyText: "No records found that match this filter",
      }}
    />
  ) : (
    <>Error</>
  );
};

export default EventApplicationTable;
