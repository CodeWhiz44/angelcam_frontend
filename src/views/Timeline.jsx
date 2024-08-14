import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthProvider";

const getTimeLabel = (date, format = "date") => {
  const dateTime = new Date(date);
  const dateStr = `${
    dateTime.getMonth() + 1
  }/${dateTime.getDate()}/${dateTime.getFullYear()}`;
  const timeStr = (() => {
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = `${hours}`.padStart(2, "0");
    minutes = `${minutes}`.padStart(2, "0");
    return `${hours}:${minutes} ${ampm}`;
  })();

  if (format === "date") return dateStr;
  if (format === "time") return timeStr;
  return `${dateStr} ${timeStr}`;
};

const TimeDot = ({ label = "", className = "", left = 0 }) => {
  return (
    <div
      className={`absolute flex flex-col-reverse gap-y-1 items-center transform -translate-x-1/2 -translate-y-full -top-1.5 ${className}`}
      style={{ left: `${left}%` }}
    >
      <span className="w-1 h-1 rounded-full bg-white"></span>
      <p className="text-white text-sm">{label}</p>
    </div>
  );
};

const TimeRange = ({
  startTime,
  endTime,
  range,
  timeRange,
  isLast,
  onClick,
}) => {
  const { start, end } = range;
  const totalRange = endTime.getTime() - startTime.getTime();
  const startPercent =
    ((start.getTime() - startTime.getTime()) / totalRange) * 100;
  const endPercent = ((end.getTime() - startTime.getTime()) / totalRange) * 100;
  const widthPercent = endPercent - startPercent;

  return (
    <div
      className={`absolute h-full top-0 ${
        timeRange !== "total" ? "bg-blue-600" : ""
      }`}
      style={{
        left: `${startPercent}%`,
        width: `${widthPercent}%`,
      }}
      onClick={onClick}
    >
      {timeRange === "total" && (
        <>
          <TimeDot label={getTimeLabel(start)} left={startPercent} />
          {isLast && <TimeDot label={getTimeLabel(end)} left={endPercent} />}
        </>
      )}
    </div>
  );
};

const Timeline = ({ cameraId, range, onStreamUrlChange }) => {
  if (!range) return null;

  const { AuthenticatedFetch } = useAuth();
  const { recording_start, recording_end } = range;
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [middleTimes, setMiddleTimes] = useState([]);
  const [timeRange, setTimeRange] = useState("total");

  const splitTimeline = () => {
    const startDate = new Date(recording_start),
      endDate = new Date(recording_end);
    setStartTime(startDate);
    setEndTime(endDate);

    const result = [];
    let curStart = new Date(startDate);
    let finalEnd = new Date(endDate);
    while (curStart < finalEnd) {
      let curEnd = new Date(curStart);
      curEnd.setDate(curStart.getDate() + 1);

      if (curEnd > finalEnd) {
        curEnd = finalEnd;
      }

      result.push({ start: new Date(curStart), end: new Date(curEnd) });
      curStart = new Date(curEnd);
    }
    setMiddleTimes(result);
  };

  const handleTotalTimelineClick = () => {
    setTimeRange("total");
    splitTimeline();
  };

  const handleMidTimeClick = (midTime) => () => {
    if (timeRange === "total") {
      AuthenticatedFetch({
        method: "GET",
        url:
          `${
            import.meta.env.VITE_API_ROOT
          }/api/shared-cameras/${cameraId}/recording/timeline?` +
          new URLSearchParams({
            start: new Date(midTime.start).toISOString(),
            end: new Date(midTime.end).toISOString(),
          }),
      }).then((res) => {
        const { start, end, segments } = res;
        setStartTime(new Date(start));
        setEndTime(new Date(end));
        setMiddleTimes(
          segments.map((segment) => ({
            start: new Date(segment.start),
            end: new Date(segment.end),
          }))
        );
        setTimeRange("day");
      });
    } else if (timeRange === "day") {
      setTimeRange("segment");
      setStartTime(new Date(midTime.start));
      setEndTime(new Date(midTime.end));
      setMiddleTimes([]);
      AuthenticatedFetch({
        method: "GET",
        url:
          `${
            import.meta.env.VITE_API_ROOT
          }/api/shared-cameras/${cameraId}/recording/stream?` +
          new URLSearchParams({
            start: new Date(midTime.start).toISOString(),
          }),
      }).then((res) => {
        const { url } = res;
        onStreamUrlChange(url);
      });
    } else if (timeRange === "segment") {
    }
  };

  useEffect(() => {
    splitTimeline();
  }, [recording_start, recording_end]);

  return (
    <div className="w-full relative h-4 rounded-sm bg-red-500 mt-2.5">
      <div>
        {middleTimes.map((midTime, index) => (
          <TimeRange
            key={index}
            startTime={startTime}
            endTime={endTime}
            range={midTime}
            timeRange={timeRange}
            isLast={index === middleTimes.length}
            onClick={handleMidTimeClick(midTime)}
          />
        ))}
        {timeRange !== "total" && (
          <div>
            <TimeDot
              label={getTimeLabel(
                startTime,
                timeRange === "segment" ? "datetime" : "date"
              )}
              left={0}
            />
            <TimeDot
              label={getTimeLabel(
                endTime,
                timeRange === "segment" ? "datetime" : "date"
              )}
              left={100}
            />
          </div>
        )}
      </div>
      {timeRange !== "total" && (
        <div className="absolute mt-6">
          <button onClick={handleTotalTimelineClick}>
            Display total timeline
          </button>
        </div>
      )}
    </div>
  );
};

export default Timeline;
