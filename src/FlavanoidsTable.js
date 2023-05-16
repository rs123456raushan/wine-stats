import React from 'react';
import { dataset } from './Dataset'; // Import wine_data.json data array 
import './App.css';

interface ClassStatistics {
  values: number[];
  mean: number;
  median: number;
  mode: number;
}

const getClassStatistics = (): Record<string, ClassStatistics> => {
  // Calculate the class-wise statistics
  const classStatistics: Record<string, ClassStatistics> = {};

  dataset.forEach((item) => {
    const { Alcohol, Flavanoids } = item;

    if (!classStatistics[Alcohol]) {
      classStatistics[Alcohol] = { values: [], mean: 0, median: 0, mode: 0 };
    }

    classStatistics[Alcohol].values.push(Flavanoids);
  });

  Object.keys(classStatistics).forEach((key) => {
    const values = classStatistics[key].values;

    // Calculate the mean
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / values.length;
    classStatistics[key].mean = mean;

    // Calculate the median
    values.sort((a, b) => a - b);
    const middle = Math.floor(values.length / 2);
    const median = values.length % 2 === 0 ? (values[middle - 1] + values[middle]) / 2 : values[middle];
    classStatistics[key].median = median;

    // Calculate the mode
    const countMap: Record<number, number> = {};
    let maxCount = 0;
    let mode = 0;

    values.forEach((value) => {
      if (!countMap[value]) {
        countMap[value] = 0;
      }
      countMap[value] += 1;

      if (countMap[value] > maxCount) {
        maxCount = countMap[value];
        mode = value;
      }
    });

    classStatistics[key].mode = mode;
  });

  return classStatistics;
};

const FlavanoidsTable: React.FC = () => {
  const classStatistics = getClassStatistics();

  return (
    <div>
      <h1 className='center'>Flavanoids statistical data</h1>
      <table className="statistics-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Flavanoids Mean</th>
            <th>Flavanoids Median</th>
            <th>Flavanoids Mode</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(classStatistics).map((key) => {
            const { mean, median, mode } = classStatistics[key];
            return (
              <tr key={key}>
                <td>{'Class ' + key}</td>
                <td>{Math.round((mean + Number.EPSILON) * 1000) / 1000}</td>
                <td>{Math.round((median + Number.EPSILON) * 1000) / 1000}</td>
                <td>{Math.round((mode + Number.EPSILON) * 1000) / 1000}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FlavanoidsTable;
