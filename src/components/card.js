import * as React from "react";
import { Link } from "gatsby";
import {Box, Flex, Grid, GridItem, Heading, Text} from "@chakra-ui/react";
import Tag from "./tag";

const MyCard = ({path, date, title, tags, content, description}) => {
    return(
        <Box borderTop='1px' borderColor='gray.200' paddingTop={4}>
            <Grid templateColumns='repeat(4, 1fr)' gap={6}>
                <GridItem colSpan={1}>
                    <Text fontSize='md' color='gray.500' mt={2}>{date}</Text>
                </GridItem>
                <GridItem colSpan={3}>
                    <Heading as='h2' size='lg' paddingBottom={1}><Link to={path}>{title}</Link></Heading>
                    <Flex mt='2'>
                        {tags.map(tag => <Tag name={tag}/>)}
                    </Flex>
                    <Text my='3'>{description}</Text>
                    <Text>{content}</Text>
                </GridItem>
            </Grid>
        </Box>
    )
};

export default MyCard;