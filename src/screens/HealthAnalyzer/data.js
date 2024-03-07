import images from '../../../assets/images';

const data = [
  {
    title: 'pluseRate',
    measureTitle: 'Pluse Rate',
    progressImg: images.heart,
    progressValue: '70%',
    progressTitle: 'BPM',
    lastMeasure: 'Jan 21, 2024 09:00am',
    zoneTitle: 'Heart Rate Zone',
    zoneValue: '70',
    button: 'Measure BPM',
    monitorImg: images.thumbScan,
  },
  {
    title: 'spo2',
    measureTitle: 'Oxygen Rate',
    progressImg: images.sp02,
    progressValue: '72%',
    progressTitle: 'SpO2',
    lastMeasure: 'Jan 21, 2024 10:00am',
    zoneTitle: 'Oxygen Zone',
    zoneValue: '72',
    button: 'Measure SpO2',
    monitorImg: images.thumbScan,
  },
  {
    title: 'temprature',
    measureTitle: 'Body Temperature',
    progressImg: images.temperature,
    progressValue: '97.7%',
    progressTitle: 'OF',
    lastMeasure: 'Jan 21, 2024 07:00am',
    zoneTitle: 'Body Temperate Zone',
    zoneValue: '97.7%',
    button: 'Measure OF',
    monitorImg: images.thumbScan,
  },
  {
    title: 'weight',
    measureTitle: 'Body Measurement',
    progressImg: images.weight,
    progressValue: '66',
    lastMeasure: 'Jan 21, 2024 16:00pm',
    button: 'Measure Weight',
    monitorImg: images.measureWeight,
  },
];

export default data;
