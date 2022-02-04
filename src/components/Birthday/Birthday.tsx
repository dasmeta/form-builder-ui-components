import React, { useState, useCallback, useEffect, forwardRef } from "react";
import { Row, Col, Select } from "antd";
import range from "lodash/range";
import moment from "moment";

const years = range(new Date().getFullYear() - 100, new Date().getFullYear() - 1).reverse();
const months = moment.months();

type BirthdayProps = {
    value?: any;
    size?: any;
    onChange?: Function;
}

const Birthday = forwardRef<any, BirthdayProps>(({ value, onChange, size = "default" }) => {
    const m = moment(value || Date.now());
    const [year, setYear] = useState(value && m.year());
    const [month, setMonth] = useState(value && m.format("MMMM"));
    const [day, setDay] = useState(value && parseInt(m.format("D"), 10));
    const [days, setDays] = useState((value && range(1, m.daysInMonth() + 1)) || []);

    useEffect(() => {
        if (!year || !month || !day || !onChange) {
            return;
        }
        const val = `${year}-${moment()
            .month(month)
            .format("MM")}-${day.toString().padStart(2, "0")}`;
        if (value === val) {
            return;
        }
        onChange(val);
    }, [year, month, day]);

    const handleYearChange = useCallback(value => {
        setYear(value);
        if (month) {
            const maxDay = moment(`${value} ${month}`, "YYYY MMMM").daysInMonth();
            setDays(range(1, maxDay + 1));
            if (day > maxDay) {
                setDay(maxDay);
            }
        }
    }, []);

    const handleMonthChange = useCallback(value => {
        setMonth(value);
        const maxDay = moment(`${year} ${value}`, "YYYY MMMM").daysInMonth();
        setDays(range(1, maxDay + 1));
        if (day > maxDay) {
            setDay(maxDay);
        }
    }, []);

    const handleDayChange = useCallback(value => {
        setDay(value);
    }, []);

    return (
        <Row gutter={8}>
            <Col xs={24} sm={8}>
                <Select
                    size={size}
                    showSearch
                    onChange={handleYearChange}
                    value={year}
                    style={{ width: "100%" }}
                    options={years.map(item => ({ key: item, value: item }))}
                />
            </Col>
            <Col xs={24} sm={9}>
                <Select
                    size={size}
                    showSearch
                    disabled={!year}
                    onChange={handleMonthChange}
                    value={month}
                    style={{ width: "100%" }}
                    options={months.map(item => ({ key: item, value: item }))}
                />
            </Col>
            <Col xs={24} sm={7}>
                <Select
                    size={size}
                    showSearch
                    disabled={!year || !month}
                    onChange={handleDayChange}
                    value={day}
                    style={{ width: "100%" }}
                    options={days.map(item => ({ key: item, value: item }))}
                />
            </Col>
        </Row>
    );
});

export default Birthday;
