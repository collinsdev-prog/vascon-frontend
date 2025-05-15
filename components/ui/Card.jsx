import React from 'react';

const Card = ({ 
  children, 
  title, 
  className = '', 
  titleAction,
  ...props 
}) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && (
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
          {titleAction && (
            <div className="card-title-action">
              {titleAction}
            </div>
          )}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;