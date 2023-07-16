import styled from "@emotion/styled"
export const HomeStyled = styled.div`
    .action-bar{
        position: sticky;
        top: 10px;
        display:flex;
        justify-content:space-between;
        width:100%;
        border:1px #ddd solid;
        border-radius: 25px;
        padding: 0 25px;
        gap:10px;
        margin-bottom: 10px;
        &>div{
          display:flex;
          justify-content:center;  
          align-items:center;
          flex-grow:1;
          .fa-solid{
            font-size: 20px;
            margin-right: 10px;
          }
        }
        input{
            &:focus{
                outline:none;
            }
            flex-grow:1;
            border:none;
            background-color: transparent;
            font-size: 20px;
        }
        .category-filter__select{
            min-width: 120px;
            
        }
        
    }
    .filter-section{
        display:flex;
        gap:2rem;
    }
    .sort-section{
        display:flex;
        justify-content:space-between;
    }
`