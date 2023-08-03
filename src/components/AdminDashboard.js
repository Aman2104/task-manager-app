import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../styles/Dashboard.css'
const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const chartRef = useRef(null);

  useEffect(() => {
    // Fetch tasks data from the API endpoint
    fetch('http://localhost:5000/api/tasks')
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.tasks);
        setFilteredTasks(data.tasks);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      updateChart();
    }
  }, [tasks, filteredTasks]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const filteredData = tasks.filter((task) => task[name].toLowerCase().includes(value.toLowerCase()));
    setFilteredTasks(filteredData);
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    const filteredData = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(value.toLowerCase()) ||
        task.description.toLowerCase().includes(value.toLowerCase()) ||
        task.user.toLowerCase().includes(value.toLowerCase()) ||
        task.assignedUser.toLowerCase().includes(value.toLowerCase()) ||
        task.dueDate.toLowerCase().includes(value.toLowerCase()) ||
        task.status.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTasks(filteredData);
  };

  const handleSortChange = (event) => {
    const { value } = event.target;
    setSortOption(value);
    const sortedData = [...filteredTasks];
    switch (value) {
      case 'title':
        sortedData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'assignedUser':
        sortedData.sort((a, b) => a.assignedUser.localeCompare(b.assignedUser));
        break;
      case 'dueDate':
        sortedData.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case 'status':
        sortedData.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        break;
    }
    setFilteredTasks(sortedData);
  };

  const updateChart = () => {
    const statusCounts = {};
    filteredTasks.forEach((task) => {
      statusCounts[task.status] = statusCounts[task.status] ? statusCounts[task.status] + 1 : 1;
    });

    const data = Object.entries(statusCounts);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400;
    const height = 200;

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[1])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    svg
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(d[0]))
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => y(0) - y(d[1]))
      .attr('width', x.bandwidth());

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

    svg.attr('viewBox', [0, 0, width, height]);
  };

  return (
    <div className="container">
  <div className="input-container">
    <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search..." />
  </div>
  <div className="input-container">
    <select className="filter-select" name="title" onChange={handleFilterChange}>
      <option value="">All Tasks</option>
      {tasks.map((task) => (
        <option key={task._id} value={task.title}>
          {task.title}
        </option>
      ))}
    </select>
    <select className="filter-select" name="assignedUser" onChange={handleFilterChange}>
      <option value="">All Assigned Users</option>
      {tasks.map((task) => (
        <option key={task._id} value={task.assignedUser}>
          {task.assignedUser}
        </option>
      ))}
    </select>
    {/* Add more filter options as needed */}
  </div>
  <div className="input-container">
    <select className="sort-select" name="sortOption" onChange={handleSortChange}>
      <option value="">No Sorting</option>
      <option value="title">Title</option>
      <option value="assignedUser">Assigned User</option>
      <option value="dueDate">Due Date</option>
      <option value="status">Status</option>
    </select>
  </div>
  <div>
    {/* Render the tasks based on the filtered and sorted data */}
    {filteredTasks.map((task) => (
      <div key={task._id} className="task-container">
        <p className="task-details">Title: {task.title}</p>
        <p className="task-details">Description: {task.description}</p>
        <p className="task-details">Status: {task.status}</p>
        <p className="task-details">Due Date: {task.dueDate}</p>
        <p className="task-details">User: {task.user}</p>
        <p className="task-details">Assigned User: {task.assignedUser}</p>
        {/* <button onClick={() => handleEdit(task._id)}>Edit</button>
        <button onClick={() => handleDelete(task._id)}>Delete</button> */}
      </div>
    ))}
  </div>
  <div className="chart-container">
    {/* D3 chart container */}
    <svg ref={chartRef}></svg>
  </div>
</div>

  );
};

export default Dashboard;

