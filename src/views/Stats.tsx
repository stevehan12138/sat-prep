import { 
	SimpleGrid,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	IconButton,
	useDisclosure,
	Collapse,
	Text
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { 
	LineChart, 
	Line, 
	XAxis, 
	YAxis,
	Tooltip,
	BarChart, 
	Bar,
} from 'recharts';
import { useEffect } from 'react';

import PastStats from './PastStats';

export default function Stats({ isOver, timeSpent, total, totalTime, timeCompensation, section }: { isOver: boolean, timeSpent: Array<number>, total: number, totalTime: number, timeCompensation: boolean, section: string }) {

	const { isOpen, onToggle } = useDisclosure();

	const getHistogramData = (timeSpent: Array<number>) => {
		let rLess30 = 0;
		let r3090 = 0;
		let r90150 = 0;
		let r150More = 0;
		timeSpent.forEach(time => {
			if (time < 30000) {
				rLess30++;
			} else if (time >= 30000 && time < 90000) {
				r3090++;
			} else if (time >= 90000 && time < 150000) {
				r90150++;
			} else {
				r150More++;
			}
		});
		return [
			{ name: '< 30s', t: rLess30 },
			{ name: '30-90s', t: r3090 },
			{ name: '90-150s', t: r90150 },
			{ name: '> 150s', t: r150More }
		];
	}

	useEffect(() => {
		if(isOver){
			let tests;
			if(localStorage.getItem('tests') === null) {
				tests = [];
			} else {
				tests = JSON.parse(localStorage.getItem('tests') as string);
			}

			tests.unshift({
				total: total,
				totalTime: totalTime,
				timeCompensation: timeCompensation,
				date: new Date().toString(),
				timeSpent: timeSpent,
				section: section
			});

			localStorage.setItem('tests', JSON.stringify(tests));
			if(!isOpen){
				onToggle();
			}
		}
	}, [isOver]);

	return (
		<>
		<Text fontSize='20px' fontWeight='bold' mt='30px' color='white' textAlign='center'>Stats</Text>
		<IconButton aria-label='collapse' onClick={onToggle} icon={isOpen ? <TriangleDownIcon /> : <TriangleUpIcon />} 
			backgroundColor='transparent' color='white' display='block' m='0 auto'fontSize='20px' _hover={{backgroundColor: '#424B61'}}/> 
		<Collapse in={isOpen}>
		<SimpleGrid minChildWidth='500px' w='90%' m='0 auto' spacing='40px'>
			{ total > 0 ?
				<>
				<TableContainer color='white' w='350px' maxH='400px' overflowY='auto' m='0 auto'
					sx={{ 
					'::-webkit-scrollbar': {
							width: '7px',

						}, 
						'::-webkit-scrollbar-track': {
							background: '#9EA7BD'
						},
						'::-webkit-scrollbar-thumb': {
							background: '#7986A4'
						},
						'::-webkit-scrollbar-thumb:hover': {
							background: '#637192'
						},
					}}>
					<Table variant='simple'>
						<Thead>
							<Tr>
								<Th color='white'>Question</Th>
								<Th color='white'>Time Spent(s)</Th>
							</Tr>
						</Thead>
						<Tbody>
							{timeSpent.map((item: number, index: number) => {
								return (
									<Tr key={index}>
										<Td color='white'>{index+1}</Td>
										<Td color='white'>{item/1000}</Td>
									</Tr>
								)
							})}
						</Tbody>
					</Table>
				</TableContainer>
				<LineChart width={500} height={300} data={timeSpent.map((item: number, index: number) => {
					return {
						name: `Q${index+1}`,
						Seconds: item/1000
					}})}>
					<Line type="monotone" dataKey="Seconds" stroke="#7F879F" />
						<XAxis dataKey="name" stroke="white"/>
						<YAxis stroke="white" />
					<Tooltip />
				</LineChart>
				<BarChart width={500} height={300} data={getHistogramData(timeSpent)}>
					<XAxis stroke="white" dataKey="name" />
					<YAxis stroke="white"/>
					<Bar dataKey="t" barSize={30} fill="#7F879F" />
				</BarChart>
				</>
				: <Text fontSize='20px' mt='50px' color='white' textAlign='center'>No ongoing test</Text> 
			}
		</SimpleGrid>

		<PastStats />

		</Collapse>
		</>
	);
}
 