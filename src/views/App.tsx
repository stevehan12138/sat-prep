import { 
	Box,
	useDisclosure,
	SlideFade,
	Heading,
	useToast,
	Text,
	SimpleGrid 
} from '@chakra-ui/react';
import { useTimer, useStopwatch } from 'react-timer-hook';
import { useState, useRef, useEffect } from 'react';

import Form from './Form';
import TimerControl from './TimerControl';
import Stats from './Stats';

import useSound from 'use-sound';
import notification from './data/notification.wav';

export default function App() {
	const { isOpen: isFormOpen, onClose: onFormClose } = useDisclosure({ defaultIsOpen: true });
	const { isOpen: isTimerControlOpen, onOpen: onTimerControlOpen, onClose: onTimerControlClose } = useDisclosure();
	const [ section, setSection ] = useState('');
	const [ completed, setCompleted ] = useState(-1);
	const [ total, setTotal ] = useState(0);
	const [ timeShouldSpent, setTimeShouldSpent ] = useState(-1);
	const [ timeCompensation, setTimeCompensation ] = useState(false);
	const [ totalTime, setTotalTime ] = useState(0);
	const [ isOverTime, setIsOverTime ] = useState(false);
	const [ startTime, setStartTime ] = useState(0);
	const [ timeSpent, setTimeSpent ] = useState<Array<number>>([]);
	const [ isTimingOver, setIsTimingOver ] = useState(false);

	const completedRef = useRef<number>();
	const totalRef = useRef<number>();
	completedRef.current = completed
	totalRef.current = total as number;
	const [time, setTime] = useState(Date.now());
	const toast = useToast()

	const [play] = useSound(notification);

	const onTimerExpired = () => {
		toast({
			title: 'Time is up',
			description: 'You can still finish the test in overtime',
			status: 'info',
			duration: 5000,
			isClosable: true,
		})
		setIsOverTime(true);
		play();
		qReset();
	}

	const {
		seconds,
		minutes,
		hours,
		pause,
		resume,
		restart,
	} = useTimer({ expiryTimestamp: new Date(time) , autoStart: false, onExpire: onTimerExpired });

	const hoursRef = useRef<number>();
	const minutesRef = useRef<number>();
	const secondsRef = useRef<number>();
	hoursRef.current = hours;
	minutesRef.current = minutes;
	secondsRef.current = seconds;

	const {
		seconds: qSeconds,
		minutes: qMinutes,
		hours: qHours,
		isRunning: qIsRunning,
		start: qStart,
		pause: qPause,
		reset: qReset,
	} = useStopwatch({ autoStart: false });

	const qMinutesRef = useRef<number>();
	const qSecondsRef = useRef<number>();
	qMinutesRef.current = qMinutes;
	qSecondsRef.current = qSeconds;

	useEffect(() => {
		if(timeShouldSpent === qSeconds + qMinutes * 60 && !isOverTime) {
			play();
		}
	}, [timeShouldSpent, qSeconds, qMinutes, play]);
	
	const handleNext = () => {
		if(completedRef.current === undefined || totalRef.current === undefined) {
			return;
		}
		play();
		setCompleted(completedRef.current + 1);
		setTimeSpent((curTimeSpent) => {
			let sum = curTimeSpent.reduce((a, b) => a + b, 0);
			return [...curTimeSpent, Date.now() - startTime - sum];
		});
		
		if(completedRef.current + 1 >= totalRef.current) {
			toast({
				title: 'Finished!',
				description: 'You have finished the test!',
				status: 'success',
				duration: 5000,
				isClosable: true,
			})
			setIsTimingOver(true);
			qPause();
			pause();

			onTimerControlClose();
			return;
		}
		if(!isOverTime && getTimeForNextQuestion()) {
			qReset();
			if(timeCompensation) {
				setTime(time + 2000);
				restart(new Date(time + 2000));
			}
		} else {
			qPause();
		}

	}

	const getTimeForNextQuestion = () => {
		let remainingSeconds = hoursRef.current !== undefined && minutesRef.current !== undefined && secondsRef.current !== undefined ? hoursRef.current * 60 * 60 + minutesRef.current * 60 + secondsRef.current : -1;
		let remainingQuestions = totalRef.current && completedRef.current !== undefined ? totalRef.current as number - completedRef.current : -1;
		let timeForNextQuestion = Math.floor(remainingSeconds / remainingQuestions);
		if (timeForNextQuestion >= 5) {
			setTimeShouldSpent(timeForNextQuestion);
			qStart();
			return true;
		} else {
			qPause();
			setTimeShouldSpent(-1);
			toast({
				title: 'Not Enough Time',
				description: 'Less than 5 seconds per question',
				status: 'info',
				duration: 500,
				isClosable: true,
			})
			return false;
		}
	}

	const sleep = (left: number) => {
		toast({
			title: `Timer starting in ${left}...`,
			status: 'success',
			duration: 1000,
			isClosable: true,
		})
		return new Promise(resolve => setTimeout(resolve, 1000))
	}

	const handleTimerStart = async (questions: number, questionTime: number, isTimeCompensation: boolean, section: string) => {
		setTimeCompensation(isTimeCompensation);
		await sleep(3);
		await sleep(2);
		await sleep(1);
		play();
		onFormClose();
		await new Promise(resolve => setTimeout(resolve, 200))
		onTimerControlOpen();
		let time = Date.now()
		let date = time + (questionTime * 60 * 1000);
		setTotalTime(questionTime);
		setTime(date);
		setTotal(questions);
		setStartTime(time);
		setCompleted(0);
		restart(new Date(date));
		//stupid hack to make sure the timer is started
		await new Promise(resolve => setTimeout(resolve, 1000))
		getTimeForNextQuestion();
		setSection(section);
	}

	return (
		<Box bg='#373F51' h='100%' overflowY='auto'>
			<Heading as='h1' fontSize='140px' fontFamily="'Orbitron', sans-serif;" color='white' pt='100px' letterSpacing='0.15em' textAlign='center'>{("0" + hours).slice(-2)}:{("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}</Heading>
			<SimpleGrid columns={3} w='1200px' m='0 auto' mt='15px'>
				{completed >= 0 && <Text fontSize='20px' color='white' textAlign='center'>{completed}/{total} Completed</Text>}
				{(qIsRunning && !isOverTime) && (<>
					<Text fontSize='20px' color='white' textAlign='center'>Time recommended to spend: {timeShouldSpent}s</Text>  
					<Text fontSize='20px' color='white' textAlign='center' mb='50px'>Time spent: {qMinutes * 60 + qSeconds}s</Text>
				</>)}
				{ isOverTime && <Text fontSize='20px' color='white' textAlign='center'>Overtime: {("0" + qHours).slice(-2)}:{("0" + qMinutes).slice(-2)}:{("0" + qSeconds).slice(-2)}</Text>}
			</SimpleGrid>
			<SlideFade in={isFormOpen} unmountOnExit>
				<Form handleStart={handleTimerStart} />
			</SlideFade>
			<SlideFade in={isTimerControlOpen} unmountOnExit>
				<TimerControl pause={() => {
					if(!isOverTime) {
						pause();
					}
					qPause();
				}} resume={() => {
					if(!isOverTime) {
						resume();
					}
					qStart();
				}} handleNext={handleNext} />
			</SlideFade>
			<Stats isOver={isTimingOver} timeSpent={timeSpent} total={total} timeCompensation={timeCompensation} totalTime={totalTime} section={section} />
		</Box>
	);
}

