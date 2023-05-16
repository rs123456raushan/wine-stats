import React from 'react';
import { dataset } from './Dataset'; // Import wine_data.json data array
import './App.css';

interface WineData {
    Alcohol: number;
    Ash: number;
    Hue: number;
    Magnesium: number;
}

interface StatisticsResult {
    [key: string]: number;
}

// Function to calculate Gamma for each point
const calculateGamma = (): WineData[] => {
    return dataset.map((data: WineData) => {
        const gamma = (data.Ash * data.Hue) / data.Magnesium;
        return { ...data, Gamma: gamma };
    });
};

// Function to calculate class-wise mean of Gamma
const calculateMean = (): StatisticsResult => {
    const gammaData = calculateGamma();
    const meanMap: StatisticsResult = {};

    gammaData.forEach((data: WineData) => {
        if (meanMap[data.Alcohol]) {
            meanMap[data.Alcohol].push(data.Gamma);
        } else {
            meanMap[data.Alcohol] = [data.Gamma];
        }
    });

    const meanResult: StatisticsResult = {};
    Object.keys(meanMap).forEach((key: string) => {
        const mean =
            meanMap[key].reduce((sum: number, value: number) => sum + value, 0) / meanMap[key].length;
        meanResult[key] = Math.round((mean + Number.EPSILON) * 1000) / 1000;
    });

    return meanResult;
};

// Function to calculate class-wise median of Gamma
const calculateMedian = (): StatisticsResult => {
    const gammaData = calculateGamma();
    const medianMap: StatisticsResult = {};

    gammaData.forEach((data: WineData) => {
        if (medianMap[data.Alcohol]) {
            medianMap[data.Alcohol].push(data.Gamma);
        } else {
            medianMap[data.Alcohol] = [data.Gamma];
        }
    });

    const medianResult: StatisticsResult = {};
    Object.keys(medianMap).forEach((key: string) => {
        const sortedValues = medianMap[key].sort((a: number, b: number) => a - b);
        const medianIndex = Math.floor(sortedValues.length / 2);
        const median =
            sortedValues.length % 2 === 0
                ? (sortedValues[medianIndex - 1] + sortedValues[medianIndex]) / 2
                : sortedValues[medianIndex];
        medianResult[key] = Math.round((median + Number.EPSILON) * 1000) / 1000;
    });

    return medianResult;
};

// Function to calculate class-wise mode of Gamma
const calculateMode = (): StatisticsResult => {
    const gammaData = calculateGamma();
    const modeMap: StatisticsResult = {};

    gammaData.forEach((data: WineData) => {
        if (modeMap[data.Alcohol]) {
            modeMap[data.Alcohol].push(data.Gamma);
        } else {
            modeMap[data.Alcohol] = [data.Gamma];
        }
    });

    const modeResult: StatisticsResult = {};
    Object.keys(modeMap).forEach((key: string) => {
        const valueMap: { [key: number]: number } = {};
        let maxCount = 0;
        let mode: number | null = null;

        modeMap[key].forEach((value: number) => {
            if (valueMap[value]) {
                valueMap[value]++;
            } else {
                valueMap[value] = 1;
            }

            if (valueMap[value] > maxCount) {
                maxCount = valueMap[value];
                mode = value;
            }
        });

        modeResult[key] = Math.round((mode + Number.EPSILON) * 1000) / 1000;
    });

    return modeResult;
};

// React component to display the statistics in tabular format
const GammaTable: React.FC = () => {
    const meanData = calculateMean();
    const medianData = calculateMedian();
    const modeData = calculateMode();

    return (
        <div>
            <h1 className='center'>Gamma statistical data</h1>
            <table className="statistics-table">
                <thead>
                    <tr>
                        <th>Class</th>
                        <th>Gamma Mean</th>
                        <th>Gamma Median</th>
                        <th>Gamma Mode</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(meanData).map((key) => (
                        <tr key={key}>
                            <td>{'Class ' + key}</td>
                            <td>{meanData[key]}</td>
                            <td>{medianData[key]}</td>
                            <td>{modeData[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GammaTable;
