import { useState } from 'react';	
import { 
	Box, 
	Text,
	Select,
	Checkbox,
	Tooltip,
	Button,
	useToast,
	NumberInput,
  	NumberInputField,
} from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

const sections: {[key: string]: { time: number, questions: number }} = require('./data/sections.json')


export default function Form(props: any) {
	const [section, setSection] = useState('');
	const [isTimeCompensation, setIsTimeCompensation] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [customTime, setCustomTime] = useState(10);
	const [customQuestions, setCustomQuestions] = useState(10);
	const toast = useToast();

	return (
		<Box>
			<Box w='400px' m='0 auto'>
				<Text fontSize='20px' color='white'>Test Section</Text>
				<Select color='white' value={section} onChange={(e) => setSection(e.target.value)} isDisabled={isDisabled}>
					<option style={{ backgroundColor: '#373F51' }} value=''>Select a test</option>
					<option style={{ backgroundColor: '#373F51' }} value='satR'>SAT - Reading</option>
					<option style={{ backgroundColor: '#373F51' }} value='satL'>SAT - Language</option>
					<option style={{ backgroundColor: '#373F51' }} value='satMw'>SAT - Math w/ Calculator</option>
					<option style={{ backgroundColor: '#373F51' }} value='satMwo'>SAT - Math w/o Calculator</option>
					<option style={{ backgroundColor: '#373F51' }} value='actE'>ACT - English</option>
					<option style={{ backgroundColor: '#373F51' }} value='actM'>ACT - Math</option>
					<option style={{ backgroundColor: '#373F51' }} value='actR'>ACT - Reading</option>
					<option style={{ backgroundColor: '#373F51' }} value='actS'>ACT - Science</option>
					<option style={{ backgroundColor: '#373F51' }} value='custom'>Custom/Partial Section</option>
				</Select>
				{ section !== 'custom' ?  
					section && <Text fontSize='18px' color='white'>{sections[section].questions} questions, {sections[section].time} minutes</Text>
					:
					<>
						<Text fontSize='18px' color='white' mt='10px'>Number of questions</Text>
						<NumberInput defaultValue={20} min={1} isDisabled={isDisabled} value={customQuestions} color='white' onChange={(e: any) => setCustomQuestions(e)}>
							<NumberInputField />
						</NumberInput>
						<Text fontSize='18px' color='white' mt='10px'>Time in minutes</Text>
						<NumberInput defaultValue={10} min={1} isDisabled={isDisabled} value={customTime} color='white' onChange={(e: any) => setCustomTime(e)}>
							<NumberInputField />
						</NumberInput>
					</>
				}
				<Checkbox color='white' mt='10px' isChecked={isTimeCompensation} isDisabled={isDisabled} onChange={() => setIsTimeCompensation(!isTimeCompensation)}>
					Time Compensation
					<Tooltip hasArrow label='Adds 2 seconds to compensate time wasted by every input' placement='bottom'>
						<InfoOutlineIcon ml='5px' />
					</Tooltip>
				</Checkbox>
				<Button colorScheme='teal' size='md' display='block' mt='10px' w='100%' isDisabled={isDisabled} onClick={() => {
					if(section === 'custom') {
						props.handleStart(customQuestions, customTime, isTimeCompensation)
						setIsDisabled(true);
						return
					}
					if(section) {
						props.handleStart(sections[section].questions, sections[section].time, isTimeCompensation, section)
						setIsDisabled(true);
					} else {
						toast({
							title: 'Start failed',
							description: "Please select a section",
							status: 'error',
							duration: 9000,
							isClosable: true,
						});
					}
				}}>
					Start
				</Button>
			</Box>
		</Box>
	);
}
