import React from 'react';
import styled from 'styled-components';
import Responsive from '../common/responsive';
import PostList from './PostContent';
import Button from '../common/button';


const Wrapper = styled(Responsive)`
    padding: 50px 0;

    .button_spacing{
        width: 100%;
        text-align: right;
    }

    .pagination{
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const NewPostButton = styled(Button)`
    display: inline-block;
    width: 6.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
`;


const Pagination = styled(Button)`
    width: 3rem;
    height: 1.5rem;
    margin: 0 3rem;
    background-color: #ddd;
    color: #aaa;

    &:hover{
        background-color: #333;
        color: #fff;
    }
`;



const PostForm = () => {
    const type = 'PostForm';

    return(
        <Wrapper>
            <div className="button_spacing">
                <NewPostButton to="/write">새 글 작성하기</NewPostButton>
            </div>
            <PostList type={type} />
            <PostList type={type} />
            <PostList type={type} />
            <ul className="pagination">
                <li>
                    <Pagination>이전</Pagination>
                </li>
                <li>1</li>
                <li>
                    <Pagination>다음</Pagination>
                </li>

            </ul>
        </Wrapper>
    )
}

export default PostForm;