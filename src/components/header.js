import React from 'react';
import {Flex, Heading, Spacer, Square} from "@chakra-ui/react";
import Menu from "./menu";

// title and menu
const Header = () => {
    return (
        <Flex mb={5}>
            <Heading as='h1' size='xl'>Dev Life</Heading>
            <Spacer />
            <Menu/>
        </Flex>
    );
}
export default Header;