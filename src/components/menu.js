import React from 'react';
import {Center, Flex, Heading} from "@chakra-ui/react";
import { Link } from "gatsby"

const Menu = () => {
    return (
        <Flex>
            <MenuItem name='Blog' link='/'/>
            <MenuItem name='Tag' link='/tags'/>
            <MenuItem name='About' link='/about'/>
        </Flex>
    );
};

export const MenuItem = ({name, link}) => {
  return (
      <Center mx={2}>
          <Heading as='h2' size='sm'>
              <Link to={link}>{name}</Link>
          </Heading>
      </Center>
  );
};


export default Menu;