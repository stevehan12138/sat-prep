import { 
	SimpleGrid,
	Box,
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
} from 'recharts';
import { useEffect, useState } from 'react';

export default function PastStats() {

	const { isOpen, onToggle } = useDisclosure();

	//bad practice, fix later
	const [ pastData, setPastData ] = useState<any>([]);

	useEffect(() => {
		const items = JSON.parse(localStorage.getItem('tests') || '[]');
		setPastData(items);
	}, []);

	return (
		<>
		<Text fontSize='18px' fontWeight='bold' mt='20px' color='white' textAlign='center'>Past Tests</Text>
		<IconButton aria-label='collapse' onClick={onToggle} icon={isOpen ? <TriangleDownIcon /> : <TriangleUpIcon />} 
			backgroundColor='transparent' color='white' display='block' m='0 auto' fontSize='18px' _hover={{backgroundColor: '#424B61'}}/> 
		<Collapse in={isOpen} >
			<SimpleGrid spacing='40px' w='70%' m='0 auto'>
				{ pastData.length > 0 ?
					pastData.map((test: any, index: any) => (
						<Box key={index} bg='#535E79' borderRadius='7px' p='30px' overflow='auto' w='1200px' m='0 auto'>
							<Box float='right'>
								<Text fontSize='18px' color='white'>Test Name: {test.section}</Text>
								<Text fontSize='18px' color='white'>Total Questions: {test.total}</Text>
								<Text fontSize='18px' color='white'>Time Allowed: {test.totalTime} minutes</Text>
								<Text fontSize='18px' color='white'>Time Spent: {(test.timeSpent.reduce((partialSum: number, a: number) => partialSum + a, 0) / 60000).toFixed(2)} minutes</Text>
								<Text fontSize='18px' color='white'>Test Date: {test.date}</Text>
								<Text fontSize='18px' color='white'>Time Compensation: {test.timeCompensation ? 'yes' : 'no'}</Text>
							</Box>
							<LineChart width={370} height={250} data={test.timeSpent.map((item: number, index: number) => {
								return {
									name: `Q${index+1}`,
									Seconds: item/1000
								}})}>
								<Line type="monotone" dataKey="Seconds" stroke="#7F879F" />
									<XAxis dataKey="name" stroke="white" />
									<YAxis stroke="white" />
								<Tooltip />
							</LineChart>
						</Box>
					))
					:
					<Text fontSize='18px' fontWeight='bold' color='white' textAlign='center'>No Past Tests</Text>
				}
			</SimpleGrid>
		</Collapse>
		</>
	);
}