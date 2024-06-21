import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { CustomTableParams, HoursTableData } from "@/interfaces/interfaces";
import { isHoursTableData } from "@/app/_utils/typeChecker";

const CustomTable: React.FC<CustomTableParams> = ({ data, dataType }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const hourSubmissionsTableCols = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "student_name",
      width: "25%",
      ...getColumnSearchProps("studentName"),
    },
    {
      title: "College",
      dataIndex: "college",
      key: "college",
      width: "10%",
      ...getColumnSearchProps("college"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "10%",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Date Submitted",
      dataIndex: "dateSubmitted",
      key: "date_submitted",
      width: "20%",
      ...getColumnSearchProps("dateSubmitted"),
    },
    {
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
      width: "8%",
      ...getColumnSearchProps("hours"),
    },
    {
      title: "Approval",
      dataIndex: "approval_status",
      key: "approval",
      width: "37%",
    },
  ];

  return data ? (
    <Table columns={hourSubmissionsTableCols} dataSource={data} />
  ) : (
    <>No data</>
  );
};

export default CustomTable;
