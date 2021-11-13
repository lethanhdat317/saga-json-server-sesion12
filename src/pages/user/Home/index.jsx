import { useState, useEffect } from "react";
import { Space, Row, Col, Card, Tag, Input, Slider } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
  getProductListAction,
  getCategoryListAction,
} from "../../../redux/actions";

import * as Styles from "./styles";

function HomePage() {
  const [categorySelected, setCategorySelect] = useState(undefined);
  const [searchKey, setSearchKey] = useState("");
  const [priceValue, setPriceValue] = useState({});

  const { productList } = useSelector((state) => state.productReducer);
  const { categoryList } = useSelector((state) => state.categoryReducer);

  const marks = {
    0: {
      style: {
        color: "#002878",
      },
      label: "0",
    },

    25000000: {
      style: {
        color: "#002878",
      },
      label: "25 Triệu",
    },
    50000000: {
      style: {
        color: "#002878",
      },
      label: "50",
    },
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoryListAction());
    dispatch(getProductListAction());
  }, []);

  function handleFilterCategory(categoryId) {
    setCategorySelect(categoryId);
    dispatch(
      getProductListAction({
        priceFilter: priceValue,
        categoryId,
        searchKey,
      })
    );
  }

  function handleSearchProduct(value) {
    setSearchKey(value);
    dispatch(
      getProductListAction({
        priceFilter: priceValue,
        searchKey: value,
        categoryId: categorySelected,
      })
    );
  }

  function onAfterChange(value) {
    const values = {
      min: value[0],
      max: value[1],
    };
    setPriceValue({
      ...priceValue,
      ...values,
    });

    dispatch(
      getProductListAction({
        priceFilter: values,
        searchKey: searchKey,
        categoryId: categorySelected,
      })
    );
  }

  function renderCategoryFilter() {
    const categorySelectedData = categoryList.data.find(
      (item) => item.id === categorySelected
    );
    if (
      !categorySelected &&
      !searchKey &&
      Object.keys(priceValue).length === 0 &&
      priceValue.constructor === Object
    )
      return null;
    return (
      <Space style={{ marginBottom: 16 }}>
        Đang filter theo:
        {categorySelected && (
          <Tag
            closable
            onClose={() => {
              setCategorySelect(undefined);
              dispatch(
                getProductListAction({
                  priceFilter: priceValue,
                  categoryId: undefined,
                  searchKey: searchKey,
                })
              );
            }}
          >
            {categorySelectedData.name}
          </Tag>
        )}
        {Object.keys(priceValue).length > 0 && (
          <Tag
            closable
            onClose={() => {
              setPriceValue({});
              dispatch(
                getProductListAction({
                  priceFilter: undefined,
                  categoryId: categorySelected,
                  searchKey: searchKey,
                })
              );
            }}
          >
            {`khoảng giá từ: ${priceValue.min} - ${priceValue.max}`}
          </Tag>
        )}
        {searchKey && (
          <Tag
            closable
            onClose={() => {
              setSearchKey("");
              dispatch(
                getProductListAction({
                  priceFilter: priceValue,
                  categoryId: categorySelected,
                  searchKey: undefined,
                })
              );
            }}
          >
            {`Tìm theo từ khóa: ${searchKey}`}
          </Tag>
        )}
      </Space>
    );
  }

  function renderCategoryList() {
    return categoryList.data.map((categoryItem, categoryIndex) => {
      return (
        <p
          key={`category-item-${categoryItem.id}`}
          onClick={() => handleFilterCategory(categoryItem.id)}
          style={{
            color: categorySelected === categoryItem.id ? "red" : "black",
            cursor: "pointer",
          }}
        >
          {categoryItem.name}
        </p>
      );
    });
  }

  function renderProductList() {
    return productList.data.map((productItem, productIndex) => {
      return (
        <Col span={6} key={`product-item-${productItem.id}`}>
          <Link to={`/product/${productItem.id}`}>
            <Card size="small" title={productItem.name}>
              <div>{productItem.price.toLocaleString()}</div>
            </Card>
          </Link>
        </Col>
      );
    });
  }
  return (
    <div>
      <div>Home Page</div>
      <div style={{ padding: 16 }}>
        <Row gutter={16}>
          <Col span={4}>
            <Card title="Category Filter" size="small">
              {renderCategoryList()}
            </Card>
            <Card title="Price Filter" size="small">
              <Slider
                marks={marks}
                step={500000}
                defaultValue={100}
                min={0}
                max={50000000}
                range
                defaultValue={[0, 50000000]}
                onAfterChange={onAfterChange}
              />
            </Card>
          </Col>
          <Col span={20}>
            <Input
              placeholder="Search..."
              onChange={(e) => handleSearchProduct(e.target.value)}
              value={searchKey}
              suffix={<SearchOutlined />}
              style={{ marginBottom: 16 }}
            />
            {renderCategoryFilter()}
            <Row gutter={[16, 16]}>{renderProductList()}</Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default HomePage;
