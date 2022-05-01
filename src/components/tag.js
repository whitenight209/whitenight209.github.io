import React from 'react';
import {Box} from "@chakra-ui/react";

const Tag = ({name}) => {
    return (
        <Box bg='gray.200' mr='1' borderRadius="md" paddingX='10px' mr={2} >
            {name}
        </Box>
    )
};

export default Tag;